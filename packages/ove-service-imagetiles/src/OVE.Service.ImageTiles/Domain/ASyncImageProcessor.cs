using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using OVE.Service.ImageTiles.Models;

namespace OVE.Service.ImageTiles.Domain {
    public class ASyncImageProcessor : IHostedService, IDisposable {
        private readonly ILogger _logger;
        private readonly IConfiguration _configuration;
        private readonly ImageProcessor _processor;
        private Timer _timer;

        private readonly SemaphoreSlim _processing;
        private int maxConcurrent;

        public ASyncImageProcessor(ILogger<ASyncImageProcessor> logger, IConfiguration configuration, ImageProcessor processor) {
            _logger = logger;
            _configuration = configuration;
            _processor = processor;
            maxConcurrent = _configuration.GetValue<int>("ImageProcessingConfig:MaxConcurrent");
            _processing = new SemaphoreSlim(maxConcurrent, maxConcurrent);
        }

        public Task StartAsync(CancellationToken cancellationToken) {
            _logger.LogInformation("Async Image Processor Service is starting.");

            _timer = new Timer(ProcessImage, null, TimeSpan.Zero,
                TimeSpan.FromSeconds(_configuration.GetValue<int>("ImageProcessingConfig:PollSeconds")));

            return Task.CompletedTask;
        }

        public Task StopAsync(CancellationToken cancellationToken) {
            _logger.LogInformation("Async Image Processor Service is stopping.");

            _timer?.Change(Timeout.Infinite, 0);

            return Task.CompletedTask;
        }

        public void Dispose() {
            _timer?.Dispose();
        }

        /// <summary>
        /// Setup:
        /// 0) Register Service with Asset Manager
        /// 
        /// Steps to process an image:
        /// 1) Get the asset to process
        /// 2) Download it
        /// 3) Create DZI
        /// 4) Upload it
        /// 5) Mark it as completed
        ///
        /// API required:
        /// 1) process particular asset ID
        /// 2) get .dzi file for asset ID
        /// 3) viewer HTML
        ///
        /// </summary>
        /// <param name="state"></param>
        private async void ProcessImage(object state) {
            if (!_processing.Wait(10)) {
                _logger.LogInformation("Tried to fire Image Processing but too many threads already running");
                return;
            }

            OVEAssetModel todo = null;
            try {

                //1) get an Asset to process

                if (todo == null) {
                    _logger.LogInformation("no work for Image Processor, running Processors = " +
                                           (maxConcurrent - _processing.CurrentCount - 1));
                }
                else {

                }
            } catch (Exception e) {
                _logger.LogError(e, "Exception in Image Processing");
                if (todo != null) {


                }
            } finally {
                _processing.Release();
            }

        }
    }
}