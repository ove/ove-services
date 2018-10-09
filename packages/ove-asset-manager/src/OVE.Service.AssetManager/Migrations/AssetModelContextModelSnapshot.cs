﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using OVE.Service.AssetManager.DbContexts;

namespace OVE.Service.AssetManager.Migrations
{
    [DbContext(typeof(AssetModelContext))]
    partial class AssetModelContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.1.4-rtm-31024");

            modelBuilder.Entity("OVE.Service.AssetManager.Models.OVEAssetModel", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("AssetMeta");

                    b.Property<string>("Description");

                    b.Property<DateTime>("LastModified");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(50);

                    b.Property<string>("ProcessingErrors");

                    b.Property<int>("ProcessingState")
                        .IsConcurrencyToken();

                    b.Property<string>("Project")
                        .IsRequired()
                        .HasMaxLength(63);

                    b.Property<string>("Service")
                        .IsRequired();

                    b.Property<string>("StorageLocation");

                    b.HasKey("Id");

                    b.ToTable("OVEAssetModels");
                });
#pragma warning restore 612, 618
        }
    }
}
