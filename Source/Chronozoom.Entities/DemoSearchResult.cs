// --------------------------------------------------------------------------------------------------------------------
// <copyright company="Outercurve Foundation">
//   Copyright (c) 2013, The Outercurve Foundation
// </copyright>
// --------------------------------------------------------------------------------------------------------------------

using System;
using System.Runtime.Serialization;

namespace Chronozoom.Entities
{
    /// <summary>
    /// Contains a search result.
    /// </summary>
    [DataContract]
    public class DemoSearchResult
    {
        /// <summary>
        /// The ID of the search result.
        /// </summary>
        [DataMember(Name = "id")]
        public Guid Id { get; set; }

        /// <summary>
        /// The title of the search result.
        /// </summary>
        [DataMember(Name = "title")]
        public string Title { get; set; }

        /// <summary>
        /// The type of object contained by the search result.
        /// </summary>
        [DataMember(Name = "objectType")]
        public ObjectType ObjectType { get; set; }

        /// <summary>
        /// The year of object contained by search result. Presented only for exhibits.
        /// </summary>
        [DataMember(Name = "year", IsRequired = false)]
        public decimal Year;
    }
}