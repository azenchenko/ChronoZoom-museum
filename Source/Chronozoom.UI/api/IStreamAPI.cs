// --------------------------------------------------------------------------------------------------------------------
// <copyright company="Outercurve Foundation">
//   Copyright (c) 2013, The Outercurve Foundation
// </copyright>
// --------------------------------------------------------------------------------------------------------------------

using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Configuration;
using System.Diagnostics;
using System.Diagnostics.CodeAnalysis;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Runtime.Caching;
using System.Runtime.Serialization;
using System.Security.Cryptography;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;
using System.Text;
using System.Web;
using Chronozoom.Entities;

using Chronozoom.UI.Utils;
using System.ServiceModel.Description;
using System.IO;

namespace Chronozoom.UI
{
    public partial class ChronozoomSVC : IStreamAPI
    {
        public string PostLocalFile(Stream stream, string filename)
        {
            string localContentPath = ConfigurationManager.AppSettings["LocalContentPath"];

            System.IO.Directory.CreateDirectory(Path.Combine(System.Web.Hosting.HostingEnvironment.ApplicationPhysicalPath, localContentPath));

            string filePath = Path.Combine(System.Web.Hosting.HostingEnvironment.ApplicationPhysicalPath, localContentPath, filename);
            string newFilename = filename;

            int i = 0;

            // Add prefix to filename if it already exists.
            while (File.Exists(filePath))
            {
                newFilename = i++.ToString() + "__" + filename;
                filePath = Path.Combine(System.Web.Hosting.HostingEnvironment.ApplicationPhysicalPath, localContentPath, newFilename);
            }

            int length = 0;
            using (FileStream writer = new FileStream(filePath, FileMode.CreateNew))
            {
                int readCount;
                var buffer = new byte[100000000];
                while ((readCount = stream.Read(buffer, 0, buffer.Length)) != 0)
                {
                    writer.Write(buffer, 0, readCount);
                    length += readCount;
                }
            }

            return "/" + localContentPath + "/" + newFilename;
        }

        public string PostLocalThumbnail(Stream stream, Guid id)
        {
            string thumbsPath = ConfigurationManager.AppSettings["ThumbnailsPath"];

            System.IO.Directory.CreateDirectory(Path.Combine(System.Web.Hosting.HostingEnvironment.ApplicationPhysicalPath, thumbsPath));

            // Saving data as plain text string with base64 coded data.
            // TODO: Find solution of how to convert data from stream to a file without using temporary file.
            string filePath = Path.Combine(System.Web.Hosting.HostingEnvironment.ApplicationPhysicalPath, thumbsPath, "thumb_temp");

            int length = 0;
            using (FileStream writer = new FileStream(filePath, FileMode.Create))
            {
                int readCount;
                var buffer = new byte[100000000];
                while ((readCount = stream.Read(buffer, 0, buffer.Length)) != 0)
                {
                    writer.Write(buffer, 0, readCount);
                    length += readCount;
                }
            }

            // Read thumbnail as base64 plain text string.
            string base64 = File.ReadAllText(filePath);

            // Remove <data:image/png;base64,> from a string.
            base64 = base64.Remove(0, 22);

            filePath = Path.Combine(System.Web.Hosting.HostingEnvironment.ApplicationPhysicalPath, thumbsPath, id.ToString());

            // Save final thumbnail file.
            File.WriteAllBytes(filePath + ".png", Convert.FromBase64String(base64));

            return filePath + ".png";
        }
    }
}