﻿using DAL.Core;

namespace DAL.Models.ServiceForm
{
    public class CtForm : BaseForm
    {
        // Phiếu chỉ định chụp CT
        // Loại yêu cầu
        public CtRequestType Type { get; set; }
        // Thuốc cản quang
        public bool IsContrastMedicine { get; set; }
        public bool IsNotContrastMedicine { get; set; }
        // Sọ não
        public bool IsSkull { get; set; }
        // Tai mũi họng
        public bool IsEarNoseThroat { get; set; }
        // CS Cổ
        public bool IsCsNeck { get; set; }
        // CS Ngực
        public bool IsCsChest { get; set; }
        // CS Thắt lưng
        public bool IsCsWaist { get; set; }
        // Vai
        public bool IsShoulder { get; set; }
        // Khuỷa tay
        public bool IsElbow { get; set; }
        // Cổ tay
        public bool IsWrist { get; set; }
        // Xoang
        public bool IsSinus { get; set; }
        // Háng
        public bool IsGroin { get; set; }
        // Gối
        public bool IsKnee { get; set; }
        // Cổ chân
        public bool IsAnkle { get; set; }
        // Cổ
        public bool IsNeck { get; set; }
        // Bàn chân
        public bool IsFoot { get; set; }
        // Khung chậu
        public bool IsPelvis { get; set; }
        // Ngực
        public bool IsChest { get; set; }
        // Bụng
        public bool IsStomach { get; set; }
        // Hệ niệu
        public bool IsUrinary { get; set; }
        // Mạch máu chi trên
        public bool IsUpperVein { get; set; }
        public string UpperVein { get; set; }
        // Mạch máu chi dưới
        public bool IsLowerVein { get; set; }
        public string LowerVein { get; set; }
        // Khác
        public bool IsOther { get; set; }
        public string Other { get; set; }
        // Có thai
        public bool IsPregnant { get; set; }
        // Dị ứng
        public bool IsAllergy { get; set; }
        // Bệnh lí tim mạch
        public bool IsHeartDisease { get; set; }
        // Bệnh lí mạch máu vùng ngoại biên
        public bool IsBloodDisease { get; set; }
        // Bệnh suy thận
        public bool IsKidneyFailure { get; set; }
        // Đái tháo đường
        public bool IsDiabetesMellitus { get; set; }
        // Rối loạn đông máu
        public bool IsCoagulopathy { get; set; }
    }
}
