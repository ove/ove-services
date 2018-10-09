﻿using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using OVE.Service.AssetManager.Models;

namespace OVE.Service.AssetManager.Domain {
    public interface IAssetFileOperations {
        string ResolveFileUrl(OVEAssetModel asset);
        Task<bool> MoveFile(OVEAssetModel oldAsset, OVEAssetModel newAsset);
        Task<bool> DeleteFile(OVEAssetModel oveAssetModel);
        Task<bool> SaveFile(OVEAssetModel oveAssetModel, IFormFile upload);
    }
}