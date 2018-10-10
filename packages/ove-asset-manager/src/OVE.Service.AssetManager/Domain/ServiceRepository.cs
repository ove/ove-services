using System.Collections.Concurrent;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace OVE.Service.AssetManager.Domain {
    /// <summary>
    /// A singleton services for managing knowledge of other services.
    /// filled form appsetting.json and API updates from other services.
    /// </summary>
    public class ServiceRepository {
        private readonly ILogger<ServiceRepository> _logger;
        
        private readonly ConcurrentDictionary<string,OVEService> _knownServices =new ConcurrentDictionary<string, OVEService>();

        public ServiceRepository(ILogger<ServiceRepository> logger, IConfiguration configuration) {
            _logger = logger;

            List<OVEService> services = new List<OVEService>();
            configuration.Bind("OVEServices",services);
            
            foreach (var oveService in services) {
                _logger.LogInformation("found service from Config: "+oveService.Name);
                UpdateService(oveService);
            }
        }

        public List<SelectListItem> GetServices() {
            return _knownServices.Select(s => new SelectListItem(s.Key, s.Key)).Reverse().ToList();      
        }

        public bool ValidateServiceChoice(string serviceName, IFormFile upload) {
            var extension = Path.GetExtension(upload.FileName).ToLower();
            if (!_knownServices.ContainsKey(serviceName)) return false;
            return _knownServices[serviceName].FileTypes.Contains(extension);
        }

        public void UpdateService(OVEService service) {
            _logger.LogInformation("Updated Service "+service.Name);
            this._knownServices.AddOrUpdate(service.Name, k => service, (k, v) => service);
        }
    }
}
