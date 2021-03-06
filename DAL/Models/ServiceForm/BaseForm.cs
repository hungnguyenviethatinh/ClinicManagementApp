﻿using DAL.Core;
using DAL.Models.Interfaces;
using System;

namespace DAL.Models.ServiceForm
{
    public class BaseForm : IAuditableEntity
    {
        public int Id { get; set; }
        public string IdCode { get; set; }
        // Chẩn đoán
        public string DiagnosisName { get; set; }
        // Ngày kê đơn
        public DateTime DateCreated { get; set; }
        public PrescriptionStatus Status { get; set; }
        public int PatientId { get; set; }
        public Patient Patient { get; set; }
        public string DoctorId { get; set; }
        public User Doctor { get; set; }

        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }
    }
}
