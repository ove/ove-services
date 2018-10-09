using System;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Amazon.S3;
using Amazon.S3.Model;
using Amazon.S3.Transfer;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using OVE.Service.AssetManager.Models;

namespace OVE.Service.AssetManager.Domain {
    public class S3AssetFileOperations : IAssetFileOperations {

        private readonly ILogger<S3AssetFileOperations> _logger;
        private readonly IConfiguration _configuration;

        private const string S3ClientAccessKey = "s3Client:AccessKey";
        private const string S3ClientSecret = "s3Client:Secret";
        private const string S3ClientServiceUrl = "s3Client:ServiceURL";
        private const string S3ClientDownloadUrl = "s3Client:DownloadURL";
        
        public S3AssetFileOperations(ILogger<S3AssetFileOperations> logger, IConfiguration configuration) {
            _logger = logger;
            _configuration = configuration;
        }
        
        private IAmazonS3 GetS3Client(IConfiguration configuration) {
            
            IAmazonS3 s3Client = new AmazonS3Client(
                configuration.GetValue<string>(S3ClientAccessKey),
                configuration.GetValue<string>(S3ClientSecret),
                new AmazonS3Config {
                    ServiceURL = configuration.GetValue<string>(S3ClientServiceUrl),
                    UseHttp = true, 
                    ForcePathStyle = true
                }
            );
            _logger.LogInformation("Created new S3 Client");
            return s3Client;
        }
        
        #region Implementation of IFileOperations

        public string ResolveFileURL(OVEAssetModel asset) {
            var url = _configuration.GetValue<string>(S3ClientDownloadUrl)+ Path.GetFileNameWithoutExtension(asset.StorageLocation) + "/" + asset.StorageLocation;
            return url;
        }

        public async Task<bool> MoveFile(OVEAssetModel oldAsset, OVEAssetModel newAsset) {
            //todo this is hard because we might have to move between s3 buckets and that is complex
            // https://stackoverflow.com/questions/9664904/best-way-to-move-files-between-s3-buckets
            throw new System.NotImplementedException();
        }

        public async Task<bool> DeleteFile(OVEAssetModel asset) {
            _logger.LogInformation("about to delete file "+asset);
            try {
                using (var s3Client = GetS3Client(_configuration)) {
                    // delete folder containing the file and everything
                    
                    ListObjectsResponse files = null;
                    while (files == null || files.S3Objects.Any()) {
                        if (files != null && files.S3Objects.Any()) {
                            foreach (var o in files.S3Objects) {
                                await s3Client.DeleteObjectAsync(asset.Project, o.Key);
                            }
                        }

                        // find more files
                        files = await s3Client.ListObjectsAsync(new ListObjectsRequest() {
                            BucketName = asset.Project,
                            Prefix = Path.GetFileNameWithoutExtension(asset.StorageLocation)
                        });

                    }

                    // if the bucket is empty then delete it 
                    var res = await s3Client.ListObjectsAsync(asset.Project);
                    if (!res.S3Objects.Any()) {
                        await s3Client.DeleteBucketAsync(asset.Project);
                    }
                }

                _logger.LogInformation("deleted file on s3 correctly");
                return true;
            }
            catch (Exception e) {
                _logger.LogError(e, "Failed to delete an s3 file for " + asset);
                return false;
            }
        }

        public async Task<bool> SaveFile(OVEAssetModel asset, IFormFile upload) {
            _logger.LogInformation("about to upload "+asset);

            try {

                using (var s3Client = GetS3Client(_configuration)) {
                    using (var file = upload.OpenReadStream()) {

                        // find or create the bucket
                        var buckets = await s3Client.ListBucketsAsync();
                        if (buckets.Buckets.FirstOrDefault(b => b.BucketName == asset.Project) == null) {
                            var res = await s3Client.PutBucketAsync(asset.Project);
                            if (res.HttpStatusCode != HttpStatusCode.OK) {
                                throw new Exception("could not create bucket" + asset.Project);
                            }

                            var openBucketPolicy =
                                "{\"Version\":\"2012-10-17\",\"Statement\":[{\"Effect\":\"Allow\",\"Principal\":{\"AWS\":[\"*\"]},\"Action\":[\"s3:GetBucketLocation\",\"s3:ListBucket\"],\"Resource\":[\"arn:aws:s3:::" +
                                asset.Project +
                                "\"]},{\"Effect\":\"Allow\",\"Principal\":{\"AWS\":[\"*\"]},\"Action\":[\"s3:GetObject\"],\"Resource\":[\"arn:aws:s3:::" +
                                asset.Project + "/*\"]}]}";

                            await s3Client.PutBucketPolicyAsync(asset.Project, openBucketPolicy);

                            _logger.LogInformation("Created bucket "+asset.Project);
                        }

                        // upload it 

                        using (var fileTransferUtility = new TransferUtility(s3Client)) {
                            // upload the file
                            await fileTransferUtility.UploadAsync(file, asset.Project,
                                // upload into own folder
                                Path.GetFileNameWithoutExtension(asset.StorageLocation)+"/"+asset.StorageLocation);
                        }

                    }
                }

                _logger.LogInformation("uploaded "+asset);
                return true;
            } catch (Exception e) {
                _logger.LogError(e,"Failed to upload file for "+asset);
                return false; 
            }

        }

        #endregion
    }
}