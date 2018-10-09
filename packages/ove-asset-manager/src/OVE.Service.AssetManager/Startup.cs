﻿using System;
using System.IO;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using OVE.Service.AssetManager.DbContexts;
using OVE.Service.AssetManager.Domain;
using Swashbuckle.AspNetCore.Swagger;

namespace OVE.Service.AssetManager
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        private IConfiguration Configuration { get; }
        private static string _version = "v1";

        internal static void GetVersionNumber() {
            // read version from package.json
            var packagejson = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, @"package.json");
            if (File.Exists(packagejson)) {
                var package = JObject.Parse(File.ReadAllText(packagejson));
                _version = package["version"].ToString();
            }
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.Configure<CookiePolicyOptions>(options =>
            {
                // This lambda determines whether user consent for non-essential cookies is needed for a given request.
                options.CheckConsentNeeded = context => true;
                options.MinimumSameSitePolicy = SameSiteMode.None;
            });

            //register a cors policy we can later configure to use
            services.AddCors(o => o.AddPolicy("AllowAll", builder =>
            {
                builder.AllowAnyOrigin()
                    .AllowAnyMethod()
                    .AllowAnyHeader();
            }));

            // make upload file size unlimited via gui (+ attribute on method to enable API unlimited)
            services.Configure<FormOptions>(x => {
                x.ValueLengthLimit = int.MaxValue;
                x.MultipartBodyLengthLimit = int.MaxValue; // In case of multipart
            });

            //start the uploader microservice 
            services.AddHostedService<ASyncUploader>();

            // dependency injection of domain classes 
            services.AddSingleton(Configuration);
            services.AddTransient<FileOperations>();

            // use mvc
            services.AddMvc()
                .SetCompatibilityVersion(CompatibilityVersion.Version_2_1)
                .AddXmlSerializerFormatters().AddJsonOptions(options => {
                    options.SerializerSettings.Formatting = Formatting.Indented;
                });

            // add the db
            services.AddDbContext<AssetModelContext>(options => options.UseSqlite("Data Source=AssetFiles.db"));

            // set up swagger
            services.AddSwaggerGen(options =>
            {
               
                options.SwaggerDoc(_version, new Info
                {
                    Title = "OVE Asset Management Microservice",
                    Version = _version,
                    Description = "The OVE Asset Management Microservice is used to upload and manage digital assets for use in the OVE ecosystem. " + 
                                  "This works within the OVE (Open Visualization Environment) is an open-source software stack, " + 
                                  "designed to be used in large scale visualization environments like the [Imperial College](http://www.imperial.ac.uk) " +
                                  "[Data Science Institute\'s](http://www.imperial.ac.uk/data-science/) [Data Observatory](http://www.imperial.ac.uk/data-science/data-observatory/). " +
                                  "OVE applications are applications designed to work with the OVE core. They are launched and managed within the browser-based OVE environment. " +
                                  "Each OVE application exposes a standard control API and in some cases some application specific APIs.\"",
                    TermsOfService = "Terms Of Service",
                    Contact =  new Contact { Email =  "David.Birch@imperial.ac.uk"},
                    License = new License {Name = "MIT License",Url = "https://opensource.org/licenses/MIT"}

                       
                });
                var filePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, @"OVE.Service.AssetManager.xml");
                options.IncludeXmlComments(filePath);
                options.DescribeAllEnumsAsStrings();
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            // error pages
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            } else
            {
                app.UseExceptionHandler("/Home/Error");
            }

            //enable serving all file types (e.g. .dzi)
            app.UseStaticFiles(new StaticFileOptions
            {
                ServeUnknownFileTypes = true,
                DefaultContentType = "application/json"
            });

            // may not need
            app.UseCookiePolicy();
            
            // use our cors policy defined earlier
            app.UseCors("AllowAll");

            // use mvc and set up routes for apis 
            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");
            });

            // turn swagger on
            app.UseSwagger()
                .UseSwaggerUI(c =>
                {
                    c.SwaggerEndpoint("/swagger/"+_version+"/swagger.json", "TileService "+_version);
                });
        }
    }
}
