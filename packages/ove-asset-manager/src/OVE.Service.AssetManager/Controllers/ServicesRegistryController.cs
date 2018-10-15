﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using OVE.Service.AssetManager.Domain;

namespace OVE.Service.AssetManager.Controllers
{
    /// <summary>
    /// An API to enable other OVE Services to register their capabilities with the Asset Service
    /// </summary>
    [ApiController]
    [FormatFilter]
    public class ServicesRegistryController : ControllerBase {
        private readonly ILogger<OVEAssetModelController> _logger;
        private readonly ServiceRepository _serviceRepository;

        public ServicesRegistryController(ILogger<OVEAssetModelController> logger, ServiceRepository serviceRepository) {
            _logger = logger;
            _serviceRepository = serviceRepository;
        }

        /// <summary>
        /// Register another service with the asset manager service
        /// </summary>
        /// <param name="service">the service to register</param>
        /// <returns>OK/error</returns>
        [HttpPost]
        [Route("/api/ServicesRegistry/Register")]
        public ActionResult RegisterService(OVEService service) {
            _logger.LogInformation("Received request to register service "+service.Name);
            _serviceRepository.UpdateService(service);
            return Ok();
        }
    }
}