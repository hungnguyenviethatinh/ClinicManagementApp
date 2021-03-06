﻿using DAL.Models.Interfaces;
using System;

namespace DAL.Models
{
    public class Ingredient : IAuditableEntity
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public int MedicineId { get; set; }
        public virtual Medicine Medicine { get; set; }

        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }
    }
}
