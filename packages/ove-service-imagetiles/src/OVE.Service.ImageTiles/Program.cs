﻿using System;
using System.IO;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Logging;

namespace OVE.Service.ImageTiles
{
    public class Program
    {
        public static void Main(string[] args) {
            Startup.GetVersionNumber();
            var host = CreateWebHostBuilder(args).Build();
            
            host.Run();
        }

        public static IWebHostBuilder CreateWebHostBuilder(string[] args) {
            var configBasePath = Directory.GetCurrentDirectory();

            if (!File.Exists(Path.Combine(configBasePath, "appsettings.json"))) {
                configBasePath = AppDomain.CurrentDomain.BaseDirectory;
                Console.WriteLine("Changing ContentRoot to "+configBasePath);
            }

            return WebHost.CreateDefaultBuilder(args)
                .UseContentRoot(configBasePath)
                .UseStartup<Startup>()
                .ConfigureLogging((hostingContext, logging) => {
                    logging.AddConfiguration(hostingContext.Configuration.GetSection("Logging"));
                    logging.AddConsole();
                    logging.AddDebug();
                });
        }



    }
}
