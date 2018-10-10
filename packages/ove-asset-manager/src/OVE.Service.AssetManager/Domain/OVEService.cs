using System.Collections.Generic;

namespace OVE.Service.AssetManager.Domain {
    /// <summary>
    /// Metadata about OVE Services registered with the Asset Manager 
    /// </summary>
    public class OVEService {
        /// <summary>
        /// Service Name
        /// </summary>
        public string Name { get; set; }
        /// <summary>
        /// List of file types permitted e.g. .png
        /// lowercase with period please. 
        /// </summary>
        public List<string> FileTypes { get; set; } 
    }
}