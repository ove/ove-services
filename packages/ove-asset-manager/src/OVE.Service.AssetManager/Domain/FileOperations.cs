using System;
using System.IO;
using System.Linq;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using OVE.Service.AssetManager.Models;

namespace OVE.Service.AssetManager.Domain {
    public interface IFileOperations {
        void MoveFile(OVEAssetModel oldImage, OVEAssetModel newImage);
        void DeleteFile(OVEAssetModel oveAssetModel);
        void SaveFile(OVEAssetModel oveAssetModel, IFormFile upload);
    }

    /// <summary>
    /// A class for interacting with image files on the file system
    /// </summary>
    public class FileOperations : IFileOperations {
        private readonly ILogger<FileOperations> _logger;
        private readonly IConfiguration _configuration;

        public FileOperations(ILogger<FileOperations> logger, IConfiguration configuration) {
            _logger = logger;
            _configuration = configuration;
        }

        public void MoveFile(OVEAssetModel oldImage, OVEAssetModel newImage) {
            if (oldImage.StorageLocation == null) return;
            var oldPath = Path.Combine(OVEAssetModel.GetAssetsBasePath(_configuration, _logger), oldImage.Project);
            var newPath = Path.Combine(OVEAssetModel.GetAssetsBasePath(_configuration, _logger), newImage.Project);

            var oldFile = Path.Combine(oldPath, oldImage.StorageLocation);
            var newFile = Path.Combine(newPath, newImage.StorageLocation);

            if (!Directory.Exists(newPath)) {
                Directory.CreateDirectory(newPath);
            }

            // move file
            File.Move(oldFile, newFile);
            
            // move DZI
            var dziFile = Path.ChangeExtension(oldFile, ".dzi");
            if (File.Exists(dziFile)) {
                File.Move(dziFile, Path.ChangeExtension(newFile,".dzi"));
            }

            // move files
            string dziFolder = Path.ChangeExtension(oldFile,"_files").Replace("._","_");
            if (Directory.Exists(dziFolder)) {
                string newDziFolder = Path.ChangeExtension(newFile,"_files").Replace("._","_");
                Directory.Move(dziFolder,newDziFolder);
            }

            // if the project is empty delete its folder
            if (!Directory.EnumerateFiles(oldPath).Any()) {
                Directory.Delete(oldPath);
            }
        }

        public void DeleteFile(OVEAssetModel oveAssetModel) {
            if (oveAssetModel.StorageLocation == null) return;
            var path = Path.Combine(OVEAssetModel.GetAssetsBasePath(_configuration, _logger), oveAssetModel.Project);
            var file = Path.Combine(path, oveAssetModel.StorageLocation);

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

        public void SaveFile(OVEAssetModel oveAssetModel, IFormFile upload) {
            oveAssetModel.StorageLocation = Guid.NewGuid() + Path.GetExtension(upload.FileName);

            var path = Path.Combine(OVEAssetModel.GetAssetsBasePath(_configuration, _logger), oveAssetModel.Project);

            if (!Directory.Exists(path)) {
                Directory.CreateDirectory(path);
            }

            path = Path.Combine(path, oveAssetModel.StorageLocation);

            using (FileStream fileStream =
                new FileStream(
                    path,
                    FileMode.Create)) {
                upload.CopyTo(fileStream);
                fileStream.Close();
            }
            _logger.LogInformation("Saved File "+oveAssetModel.Id);
            
        }
    }
}