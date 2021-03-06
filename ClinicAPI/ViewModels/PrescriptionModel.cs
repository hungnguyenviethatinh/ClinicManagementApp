﻿using DAL.Core;
using System;
using System.Collections.Generic;

namespace ClinicAPI.ViewModels
{
    public class PrescriptionModel : PrescriptionUpdateModel
    {
        public int PatientId { get; set; }
        public int HistoryId { get; set; }
    }

    public class PrescriptionUpdateModel
    {
        public string IdCode { get; set; }
        public string Diagnosis { get; set; }
        public string OtherDiagnosis { get; set; }
        public string Note { get; set; }
        public PrescriptionStatus Status { get; set; }
        public DateTime? DateCreated { get; set; }
    }

    public class PrescriptionViewModel : PrescriptionModel
    {
        public int Id { get; set; }
        public string DoctorId { get; set; }
        public PatientBasicViewModel Patient { get; set; }
        public DoctorViewModel Doctor { get; set; }
    }

    public class PrescriptionPartialViewModel : PrescriptionFullViewModel
    {
        public new PatientPartialViewModel Patient { get; set; }
    }

    public class PrescriptionFullViewModel : PrescriptionViewModel
    {
        public IEnumerable<PrescriptionMedicineViewModel> Medicines { get; set; }
    }

    public class PrescriptionMedicineViewModel : PrescriptionMedicineModel
    {
        public MedicinePartialViewModel Medicine { get; set; }
    }

    public class PrescriptionMedicineModel
    {
        public int PrescriptionId { get; set; }
        public int MedicineId { get; set; }

        public string Ingredient { get; set; }
        public string NetWeight { get; set; }
        public int? Quantity { get; set; }
        public string Unit { get; set; }

        public string TakePeriod { get; set; }
        public string TakeMethod { get; set; }
        public int? TakeTimes { get; set; }
        public int? AmountPerTime { get; set; }
        public string MealTime { get; set; }
        public string Note { get; set; }
    }
}
