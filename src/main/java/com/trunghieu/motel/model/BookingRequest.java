package com.trunghieu.motel.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class BookingRequest {

    @NotBlank(message = "Vui lòng nhập họ và tên của quý khách")
    private String fullName;

    @NotBlank(message = "Vui lòng nhập số điện thoại liên hệ")
    @Pattern(regexp = "^(0[3|5|7|8|9])[0-9]{8}$", message = "Số điện thoại không hợp lệ (10 chữ số, bắt đầu bằng 03, 05, 07, 08, 09)")
    private String phone;

    private String roomType;
    private String rentalType; // Theo giờ, Qua đêm, Theo ngày
    private String checkInDate;
    private String checkInTime;
    private String note;

    public BookingRequest() {
    }

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
}
