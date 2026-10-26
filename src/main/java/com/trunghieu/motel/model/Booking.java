package com.trunghieu.motel.model;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class Booking {
    private String id;
    private String createdAt;
    private String fullName;
    private String phone;
    private String roomType;
    private String rentalType;
    private String checkInDate;
    private String checkInTime;
    private String note;
    private String status; // CHỜ XÁC NHẬN, ĐÃ LIÊN HỆ, ĐÃ NHẬN PHÒNG, ĐÃ HỦY

    public Booking() {
    }

    public Booking(String id, String fullName, String phone, String roomType, 
                   String rentalType, String checkInDate, String checkInTime, String note) {
        this.id = id;
        this.createdAt = LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"));
        this.fullName = fullName;
        this.phone = phone;
        this.roomType = roomType != null && !roomType.isBlank() ? roomType : "Phòng Đơn Tiêu Chuẩn";
        this.rentalType = rentalType != null && !rentalType.isBlank() ? rentalType : "Nghỉ qua đêm";
        this.checkInDate = checkInDate != null && !checkInDate.isBlank() ? checkInDate : "Hôm nay";
        this.checkInTime = checkInTime != null && !checkInTime.isBlank() ? checkInTime : "14:00";
        this.note = note != null ? note : "";
        this.status = "CHỜ XÁC NHẬN";
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getRoomType() { return roomType; }
    public void setRoomType(String roomType) { this.roomType = roomType; }

    public String getRentalType() { return rentalType; }
    public void setRentalType(String rentalType) { this.rentalType = rentalType; }

    public String getCheckInDate() { return checkInDate; }
    public void setCheckInDate(String checkInDate) { this.checkInDate = checkInDate; }

    public String getCheckInTime() { return checkInTime; }
    public void setCheckInTime(String checkInTime) { this.checkInTime = checkInTime; }

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
