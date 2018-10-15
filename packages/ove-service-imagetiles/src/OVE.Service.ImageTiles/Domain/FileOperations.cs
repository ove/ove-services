using System;
using System.IO;
using System.Linq;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using OVE.Service.ImageTiles.Models;

namespace OVE.Service.ImageTiles.Domain {
    /// <summary>
    /// A class for interacting with image files on the file system
    /// </summary>
    public class FileOperations  {
        private readonly ILogger<FileOperations> _logger;
        private readonly IConfiguration _configuration;

        public FileOperations(ILogger<FileOperations> logger, IConfiguration configuration) {
            _logger = logger;
            _configuration = configuration;
        }

      public void DeleteFile(OVEAssetModel imageFileModel) {
            if (imageFileModel.StorageLocation == null) return;
            var path = imageFileModel.StorageLocation;//todo set this 
            var file = Path.Combine(path, imageFileModel.StorageLocation);

            if (File.Exists(file)) {
                File.Delete(file);
            }

            // delete DZI
            var dziFile = Path.ChangeExtension(file, ".dzi");
            if (File.Exists(dziFile)) {
                File.Delete(dziFile);
            }

            // delete files
            string dziFolder = Path.ChangeExtension(file,"_files").Replace("._","_");
            if (Directory.Exists(dziFolder)) {
                Directory.Delete(dziFolder,true);
            }

            // if the project is empty delete its folder
            if (!Directory.EnumerateFiles(path).Any()) {
                Directory.Delete(path);
            }

        }

    }
}