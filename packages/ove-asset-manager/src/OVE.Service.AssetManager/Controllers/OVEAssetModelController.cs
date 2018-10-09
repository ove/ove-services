﻿using System;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Formatters;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using OVE.Service.AssetManager.DbContexts;
using OVE.Service.AssetManager.Domain;
using OVE.Service.AssetManager.Models;

namespace OVE.Service.AssetManager.Controllers {

    /// <summary>
    /// API operations for upload an Image to the TileService
    /// </summary>
    [FormatFilter]
    public class OVEAssetModelController : Controller {
        private readonly AssetModelContext _context;
        private readonly ILogger<OVEAssetModelController> _logger;
        private readonly IConfiguration _configuration;
        private readonly FileOperations _fileOperations;
        
        public OVEAssetModelController(AssetModelContext context, ILogger<OVEAssetModelController> logger,
            IConfiguration configuration, FileOperations fileOperations) {
            _context = context;
            _logger = logger;
            _configuration = configuration;
            _fileOperations = fileOperations;
            _logger.LogInformation("started ImageFilModels Controller with the following path " +
                                   _configuration.GetValue<string>("AssetManagerConfig:BasePath"));
        }

        /// <summary>
        /// Enable a method to return either an Action View or a .json or .xml file as requested
        /// By default html is returned. 
        /// </summary>
        /// <typeparam name="T">type of result</typeparam>
        /// <param name="model">the result</param>
        /// <returns>either a view of the model or the model as xml or json as per request</returns>
        private ActionResult<T> FormatOrView<T>(T model) {
            return HttpContext.RequestServices.GetRequiredService<FormatFilter>()?.GetFormat(ControllerContext) == null 
                ? View(model) 
                : new ActionResult<T>(model);
        }

        #region Convenience API's 

        #region Find Id of file
        /// <summary>
        /// Return the guid of an uploaded Asset 
        /// </summary>
        /// <param name="project">Project name</param>
        /// <param name="name">Asset name</param>
        /// <returns>guid</returns>
        [HttpGet]
        [Route("/OVEAssetModelController/GetId/")]
        public  async Task<ActionResult<string>> GetId(string project, string name) {
            var imageFileModel = await _context.AssetModels
                .FirstOrDefaultAsync(m => m.Project == project && m.Name == name);

            if (imageFileModel == null) {
                return NotFound();
            }
            return imageFileModel.Id;
        }

        /// <summary>
        /// Return the partial uri 
        /// </summary>
        /// <param name="project">project name</param>
        /// <param name="name">image name</param>
        /// <returns>url of the image</returns>
        [HttpGet]
        [Route("/OVEAssetModelController/GetAssetURL/")]
        public  async Task<ActionResult<string>> GetAssetUrl(string project, string name) {
            return await GetAssetUrl(m => m.Project == project && m.Name == name);
        }

        /// <summary>
        /// Return the uri of the image
        /// </summary>
        /// <param name="id">id of the image</param>
        /// <returns>url of the image</returns>
        [HttpGet]
        [Route("/OVEAssetModelController/GetAssetURLbyId/")]
        public  async Task<ActionResult<string>> GetAssetUrl(string id) {
            return await GetAssetUrl(m => m.Id==id);
        }

        #endregion 

        private async Task<ActionResult<string>> GetAssetUrl(Expression<Func<OVEAssetModel, bool>> expression) {
            var assetModel = await _context.AssetModels.FirstOrDefaultAsync(expression);

            if (assetModel == null) {
                return NotFound();
            }

            // todo get from object store 
            if (assetModel.ProcessingState == 4) {
                return _configuration.GetValue<string>("ASyncUploader:ServiceURL") + assetModel.Project + "/" +
                       assetModel.StorageLocation;
            }
            else {
                return _configuration.GetValue<string>("AssetManagerConfig:BasePath") + assetModel.Project + "/" +
                       assetModel.StorageLocation;
            }
        }

        #endregion

        /// <summary>
        /// Return the index page
        /// </summary>
        /// <returns>index page</returns>
        [HttpGet]
        [Route("/OVEAssetModelController/")]
        public async Task<IActionResult> Index() {
            return View(await _context.AssetModels.ToListAsync());
        }

        /// <summary>
        /// Get Details of the image by guid 
        /// ImageFileModels/Details/5
        /// </summary>
        /// <param name="id">guid of the image </param>
        /// <returns>details of the image</returns>
        [HttpGet]
        [Route("/OVEAssetModelController/Details/{id}.{format?}")]
        public async Task<ActionResult<OVEAssetModel>> Details(string id) {
            if (id == null) {
                return NotFound();
            }

            var imageFileModel = await _context.AssetModels
                .FirstOrDefaultAsync(m => m.Id == id);
            if (imageFileModel == null) {
                return NotFound();
            }

            return FormatOrView(imageFileModel);
        }

        /// <summary>
        /// Returns the create page
        /// GET: ImageFileModels/Create
        /// </summary>
        /// <returns>creation gui page</returns>
        [HttpGet]
        [Route("/OVEAssetModelController/Create")]
        public IActionResult Create() {
            return View();
        }

        /// <summary>
        /// Post a new image file
        /// POST: ImageFileModels/Create
        /// </summary>
        /// <param name="oveAssetModel">Image model (Project, Name, Description)</param>
        /// <param name="upload">the image file to upload</param>
        /// <returns></returns>
        [HttpPost]
        [DisableRequestSizeLimit]
        [Route("/OVEAssetModelController/Create.{format?}")]
        public async Task<ActionResult<OVEAssetModel>> Create(
            [Bind("Project,Name,Description,Service,AssetMeta")] OVEAssetModel oveAssetModel,
            [FromForm] IFormFile upload) {

            // check if we have a file
            if (upload == null || upload.Length <= 0) {
                _logger.LogError("failed to upload a file");
                ModelState.AddModelError("Filename", "Failed to upload file");
            }
            else {
                // then try and save it
                try {
                    _fileOperations.SaveFile(oveAssetModel, upload);

                    _logger.LogInformation("received a file :) " + oveAssetModel.StorageLocation);
                }
                catch (Exception e) {
                    _logger.LogError(e, "failed to upload a file and write it to " + oveAssetModel.StorageLocation);
                    ModelState.AddModelError("Filename", "Failed to upload file");
                }
            }

            if (ModelState.IsValid) {
                _context.Add(oveAssetModel);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }

            return FormatOrView(oveAssetModel);
        }
        
        /// <summary>
        /// Return an edit view for a given ImageModel by Guid
        /// GET: ImageFileModels/Edit/5
        /// </summary>
        /// <param name="id">guid for the image</param>
        /// <returns></returns>
        [HttpGet]
        [Route("/OVEAssetModelController/Edit/{id}.{format?}")]
        public async Task<ActionResult<OVEAssetModel>> Edit(string id) {
            if (id == null) {
                return NotFound();
            }

            var imageFileModel = await _context.AssetModels.FindAsync(id);
            if (imageFileModel == null) {
                return NotFound();
            }

            return FormatOrView(imageFileModel);
        }

        /// <summary>
        /// Post an edit to an image model by its guid.
        /// Changing the file is optional, if triggered it will result in reprocessing.
        /// POST: ImageFileModels/Edit/5
        /// </summary>
        /// <param name="id">guid for the image</param>
        /// <param name="oveAssetModel">The Image Model</param>
        /// <param name="upload">optional new file</param>
        /// <returns></returns>
        [HttpPost]
        [DisableRequestSizeLimit]
        [Route("/OVEAssetModelController/Edit/{id}.{format?}")]
        public async Task<ActionResult<OVEAssetModel>> Edit(string id, [Bind("Project,Name,Description,Id,StorageLocation,Processed,ProcessingState,Service,AssetMeta")]
            OVEAssetModel oveAssetModel,[FromForm] IFormFile upload) {
            if (id != oveAssetModel.Id) {
                return NotFound();
            }

            var oldImageFileModel = await _context.AssetModels.FirstOrDefaultAsync(m => m.Id == id);
            if (oldImageFileModel == null) {
                return NotFound();
            }

            // concurrent fields need to be updated by themselves and atomically. 
            bool need2UpdateProcessingState = oldImageFileModel.ProcessingState != oveAssetModel.ProcessingState;
            if (need2UpdateProcessingState) { 
                oveAssetModel.ProcessingState = oldImageFileModel.ProcessingState;
            }

            if (ModelState.IsValid) {
                try {
                    if (oldImageFileModel.Project != oveAssetModel.Project) {
                        _fileOperations.MoveFile(oldImageFileModel, oveAssetModel);
                    }
                    //stop EF from tracking the old version so that it will allow you to update the new version
                    _context.Entry(oldImageFileModel).State = EntityState.Detached;
                    
                    if (upload != null && upload.Length > 0) {

                        // could upload directly here upload.OpenReadStream()
                        _fileOperations.DeleteFile(oveAssetModel);
                        if (oveAssetModel.ProcessingState == 4) {
                            ASyncUploader.DeleteAssetModel(oveAssetModel, _configuration);
                        }
                        _fileOperations.SaveFile(oveAssetModel,upload);
                        need2UpdateProcessingState = true;
                        
                    }

                    _context.Update(oveAssetModel);

                    await _context.SaveChangesAsync();

                    if (need2UpdateProcessingState) {
                         oveAssetModel.ProcessingState = 0;
                        _context.Update(oveAssetModel);
                        await _context.SaveChangesAsync();
                    }

                }
                catch (DbUpdateConcurrencyException) {
                    if (!ImageFileModelExists(oveAssetModel.Id)) {
                        return NotFound();
                    }

                    throw;
                }

                return RedirectToAction(nameof(Index));
            }

            return FormatOrView(oveAssetModel);
        }

        /// <summary>
        /// Return a view for confirming you want to remove an image
        /// GET: ImageFileModels/RemovableView/5
        /// </summary>
        /// <param name="id">guid of the image model</param>
        /// <returns>confirm of removal webpage</returns>
        [HttpGet]
        [Route("/OVEAssetModelController/RemovableView/{id}.{format?}")]
        public async Task<ActionResult<OVEAssetModel>> GetRemovableView(string id) {
            if (id == null) {
                return NotFound();
            }

            var imageFileModel = await _context.AssetModels
                .FirstOrDefaultAsync(m => m.Id == id);
            if (imageFileModel == null) {
                return NotFound();
            }

            return FormatOrView(imageFileModel);
        }

        /// <summary>
        /// Post to remove an image from the database.
        /// POST: ImageFileModels/Remove/5
        /// </summary>
        /// <param name="id">guid of the image model</param>
        /// <param name="format">optional format of response (xml or json)</param>
        /// <returns></returns>
        [HttpPost]
        [Route("/OVEAssetModelController/Remove/{id}.{format?}")]
        public async Task<ActionResult<bool>> Remove(string id,string format) {
            var imageFileModel = await _context.AssetModels.FindAsync(id);
            _context.AssetModels.Remove(imageFileModel);
            await _context.SaveChangesAsync();

            _fileOperations.DeleteFile(imageFileModel);
            if (imageFileModel.ProcessingState == 4) {
                ASyncUploader.DeleteAssetModel(imageFileModel, _configuration);
            }

            return string.IsNullOrWhiteSpace(format) ? RedirectToAction(nameof(Index)) : FormatOrView(true);
        }

        private bool ImageFileModelExists(string id) {
            return _context.AssetModels.Any(e => e.Id == id);
        }
    }
}