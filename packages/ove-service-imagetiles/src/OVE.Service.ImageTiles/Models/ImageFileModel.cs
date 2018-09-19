﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OVE.Service.ImageTiles.Models {
    /// <summary>
    /// Image file model to represent the meta regarding uploaded images to the object store
    /// </summary>
    [Table("ImageFiles")]
    public class ImageFileModel {

        [ScaffoldColumn(false)]
        public string Id { get; set; }
        
        [Required(AllowEmptyStrings = false)]
        [RegularExpression(@"^[-a-zA-Z0-9_]+$", ErrorMessage = "Please keep Projects names to letters, numbers and underscores")]
        public string Project { get; set; }

        [Required(AllowEmptyStrings = false)]
        [RegularExpression(@"^[-a-zA-Z0-9_.]+$", ErrorMessage = "Please keep file names to letters, numbers, dashes and underscores")]
        [MaxLength(50, ErrorMessage = "Please keep file names short - 50 characters")]
        public string Name { get; set; }
        // todo this could be filled automatically from the upload form

        public string Description { get; set; }

        [ScaffoldColumn(false)]
        public int Width { get; set; }
        [ScaffoldColumn(false)]
        public int Height { get; set; }

        /// <summary>
        /// This is the actual location of the file on the filesystem (todo this will change to object store reference)
        /// </summary>
        [ScaffoldColumn(false)]
        public string StorageLocation { get; set; }
    }
}
