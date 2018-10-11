﻿// ReSharper disable All

// This file is used by Code Analysis to maintain SuppressMessage 
// attributes that are applied to this project.
// Project-level suppressions either have no target or are given 
// a specific target and scoped to a namespace, type, member, etc.

[assembly: System.Diagnostics.CodeAnalysis.SuppressMessage("Minor Code Smell", "S101:Types should be named in camel case", Justification = "Sonar has no custom dictionaries so cannot say OVE is ok", Scope = "type", Target = "~T:OVE.Service.AssetManager.Controllers.OVEAssetModelController")]
[assembly: System.Diagnostics.CodeAnalysis.SuppressMessage("Major Code Smell", "S4144:Methods should not have identical implementations", Justification = "Sonar Does not understand how Views work", Scope = "member", Target = "~M:OVE.Service.AssetManager.Controllers.OVEAssetModelController.GetRemovableView(System.String)~System.Threading.Tasks.Task{Microsoft.AspNetCore.Mvc.ActionResult{OVE.Service.AssetManager.Models.OVEAssetModel}}")]
[assembly: System.Diagnostics.CodeAnalysis.SuppressMessage("Minor Code Smell", "S1075:URIs should not be hardcoded", Justification = "its a single / ", Scope = "member", Target = "~M:OVE.Service.AssetManager.Domain.S3AssetFileOperations.ResolveFileUrl(OVE.Service.AssetManager.Models.OVEAssetModel)~System.String")]
[assembly: System.Diagnostics.CodeAnalysis.SuppressMessage("Info Code Smell", "S1135:Track uses of \"TODO\" tags", Justification = "justification given on each occurance")]
[assembly: System.Diagnostics.CodeAnalysis.SuppressMessage("Critical Code Smell", "S927:parameter names should match base declaration and other partial definitions", Justification = "tidier code", Scope = "member", Target = "~M:OVE.Service.AssetManager.Domain.S3AssetFileOperations.DeleteFile(OVE.Service.AssetManager.Models.OVEAssetModel)~System.Threading.Tasks.Task{System.Boolean}")]
[assembly: System.Diagnostics.CodeAnalysis.SuppressMessage("Critical Code Smell", "S927:parameter names should match base declaration and other partial definitions", Justification = "tidier code", Scope = "member", Target = "~M:OVE.Service.AssetManager.Domain.S3AssetFileOperations.SaveFile(OVE.Service.AssetManager.Models.OVEAssetModel,Microsoft.AspNetCore.Http.IFormFile)~System.Threading.Tasks.Task{System.Boolean}")]
[assembly: System.Diagnostics.CodeAnalysis.SuppressMessage("Minor Code Smell", "S1075:URIs should not be hardcoded", Justification = "no other mechanism for specifying", Scope = "member", Target = "~M:OVE.Service.AssetManager.Startup.Configure(Microsoft.AspNetCore.Builder.IApplicationBuilder,Microsoft.AspNetCore.Hosting.IHostingEnvironment)")]
[assembly: System.Diagnostics.CodeAnalysis.SuppressMessage("Minor Code Smell", "S101:Types should be named in camel case", Justification = "Sonar has no custom dictionaries so cannot say OVE is ok", Scope = "type", Target = "~T:OVE.Service.AssetManager.Models.OVEAssetModel")]
[assembly: System.Diagnostics.CodeAnalysis.SuppressMessage("Major Code Smell", "S112:General exceptions should never be thrown", Justification = "<Pending>", Scope = "member", Target = "~M:OVE.Service.AssetManager.Domain.S3AssetFileOperations.SaveFile(OVE.Service.AssetManager.Models.OVEAssetModel,Microsoft.AspNetCore.Http.IFormFile)~System.Threading.Tasks.Task{System.Boolean}")]

