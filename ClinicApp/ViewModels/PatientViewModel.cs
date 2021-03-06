﻿using ClinicApp.Models;
using System.Collections.Generic;

namespace ClinicApp.ViewModels
{
    public class PatientViewModel : Patient
    {
        public string RelativePhoneNumber { get; set; }
        public string Status { get; set; }
        public string Height { get; set; }
        public string Weight { get; set; }
        public string BloodPressure { get; set; }
        public string Pulse { get; set; }
        public string Other { get; set; }
        public string Note { get; set; }
        public List<Doctor> Doctors { get; set; }
    }
}
