package com.trunghieu.motel.model;

public class BookingResponse {
    private boolean success;
    private String message;
    private String bookingCode;
    private String directCallUrl;

    public BookingResponse() {
    }

    public BookingResponse(boolean success, String message, String bookingCode, String directCallUrl) {
        this.success = success;
        this.message = message;
        this.bookingCode = bookingCode;
        this.directCallUrl = directCallUrl;
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getBookingCode() { return bookingCode; }
    public void setBookingCode(String bookingCode) { this.bookingCode = bookingCode; }

    public String getDirectCallUrl() { return directCallUrl; }
    public void setDirectCallUrl(String directCallUrl) { this.directCallUrl = directCallUrl; }
}
