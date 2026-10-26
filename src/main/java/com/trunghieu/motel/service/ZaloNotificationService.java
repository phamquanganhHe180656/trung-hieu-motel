package com.trunghieu.motel.service;

import com.trunghieu.motel.model.Booking;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class ZaloNotificationService {

    @Value("${motel.phone:0962 192 381}")
    private String phone;

    @Value("${motel.zalo:https://zalo.me/0962192381}")
    private String zaloUrl;

    public String getCleanPhone() {
        return phone != null ? phone.replaceAll("\\D", "") : "0962192381";
    }

    public String getZaloChatUrl() {
        return zaloUrl != null && !zaloUrl.isBlank() ? zaloUrl : "https://zalo.me/" + getCleanPhone();
    }

    public String generateCustomerZaloUrl(String customerPhone) {
        if (customerPhone == null || customerPhone.isBlank()) {
            return getZaloChatUrl();
        }
        String cleanCustomerPhone = customerPhone.replaceAll("\\D", "");
        return "https://zalo.me/" + cleanCustomerPhone;
    }

    public String formatConfirmationMessage(Booking booking) {
        return String.format(
            "Chào bạn %s, Nhà Nghỉ Trung Hiếu (Xuân Khanh, Sơn Tây) đã nhận được yêu cầu đặt phòng mã [%s] cho hạng %s vào ngày %s. Nhà nghỉ xác nhận giữ phòng cho bạn nhé!",
            booking.getFullName(),
            booking.getId(),
            booking.getRoomType(),
            booking.getCheckInDate()
        );
    }
}
