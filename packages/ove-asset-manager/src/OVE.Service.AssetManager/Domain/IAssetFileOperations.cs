using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using OVE.Service.AssetManager.Models;

namespace OVE.Service.AssetManager.Domain {
    public interface IAssetFileOperations {
        Task<bool> MoveFile(OVEAssetModel oldImage, OVEAssetModel newImage);
        Task<bool> DeleteFile(OVEAssetModel oveAssetModel);
        Task<bool> SaveFile(OVEAssetModel oveAssetModel, IFormFile upload);
    }
}