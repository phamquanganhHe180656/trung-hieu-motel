package com.trunghieu.motel.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.trunghieu.motel.model.Booking;
import com.trunghieu.motel.model.BookingRequest;
import com.trunghieu.motel.model.BookingResponse;
import com.trunghieu.motel.model.RoomInfo;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.util.*;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class MotelService {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final File dataFile = new File("data/bookings.json");
    private final List<Booking> bookings = new CopyOnWriteArrayList<>();

    public MotelService() {
    }

    @PostConstruct
    public void init() {
        loadBookings();
        if (bookings.isEmpty()) {
            // Seed sample bookings for the motel
            bookings.add(new Booking("TH-1021", "Trần Văn Hoàng", "0988123456", "Phòng Đơn Tiêu Chuẩn", "Nghỉ qua đêm", "26/10/2026", "21:30", "Khách gọi hỏi còn phòng đơn không"));
            bookings.add(new Booking("TH-1018", "Lê Minh Tuấn", "0912998877", "Phòng Nghỉ Thoáng Mát", "Nghỉ theo giờ", "26/10/2026", "14:00", "Đi phượt Ba Vì về nghỉ trưa 3 tiếng"));
            saveBookingsToFile();
        }
    }

    private synchronized void loadBookings() {
        try {
            if (dataFile.exists()) {
                List<Booking> loaded = objectMapper.readValue(dataFile, new TypeReference<List<Booking>>() {});
                bookings.clear();
                bookings.addAll(loaded);
            }
        } catch (IOException e) {
            System.err.println("Lỗi khi đọc file bookings.json: " + e.getMessage());
        }
    }

    private synchronized void saveBookingsToFile() {
        try {
            File parentDir = dataFile.getParentFile();
            if (parentDir != null && !parentDir.exists()) {
                parentDir.mkdirs();
            }
            objectMapper.writerWithDefaultPrettyPrinter().writeValue(dataFile, bookings);
        } catch (IOException e) {
            System.err.println("Lỗi khi ghi file bookings.json: " + e.getMessage());
        }
    }

    public List<RoomInfo> getAllRooms() {
        return List.of(
            new RoomInfo(
                "phong-don-tieu-chuan",
                "Phòng Đơn Tiêu Chuẩn (Có 03 Phòng: 203, 204, 205)",
                "Phòng 1 giường lớn đệm êm ái, ga trải trắng tinh thơm tho, điều hòa Casper 1 chiều làm lạnh mát rượi, TV treo tường, bàn trà ghế gỗ và WC riêng biệt. Thích hợp cho 1-2 người.",
                "90.000đ (1h đầu • +10k/h sau)",
                "250.000đ",
                "300.000đ",
                "/images/204_2.jpg",
                List.of("Có 03 phòng đơn (203, 204, 205)", "1 Giường lớn đệm êm ái", "Điều hòa Casper 1 chiều làm lạnh nhanh", "TV treo tường & Bàn trà gỗ", "100% WC khép kín có nóng lạnh 24/24"),
                true
            ),
            new RoomInfo(
                "phong-doi-rong-rai",
                "Phòng Đôi Rộng Rãi (Có 02 Phòng: 201, 202)",
                "Phòng trang bị 2 giường to rộng 2m x 1.8m thoáng mát, điều hòa Casper 1 chiều làm lạnh sâu nhanh chóng, tủ quần áo gỗ, bàn ghế uống trà và WC khép kín. Phù hợp cho 2-4 người hoặc gia đình nhỏ.",
                "100.000đ (1h đầu • +20k/h sau)",
                "300.000đ",
                "350.000đ",
                "/images/202_2.jpg",
                List.of("Có 02 phòng đôi (201, 202)", "2 Giường to rộng 2m x 1.8m", "Điều hòa 1 chiều làm mát sâu", "Nền gạch vân đá sáng bóng", "100% WC khép kín riêng biệt từng phòng"),
                false
            ),
            new RoomInfo(
                "phong-tam-ve-sinh-khep-kin",
                "Tiện Nghi Phòng Tắm WC (Trang Bị Cả 5 Phòng 201 - 205)",
                "Tất cả 5 phòng (3 phòng đơn 203, 204, 205 & 2 phòng đôi 201, 202) tại Nhà Nghỉ Trung Hiếu đều có nhà tắm & WC khép kín riêng biệt 100%, vòi sen nóng lạnh 24/24, gương soi và khăn tắm sạch sẽ.",
                "Đầy đủ tiện nghi",
                "Khép kín 100%",
                "Nóng lạnh 24/24",
                "/images/real_map_3.jpg",
                List.of("100% WC khép kín riêng từng phòng (201 - 205)", "Nước nóng lạnh 24/24 cả đông lẫn hè", "Vòi tắm hoa sen & gương soi", "Khăn tắm sạch sẽ xếp sẵn", "Vệ sinh khử trùng sau mỗi lượt khách"),
                false
            )
        );
    }

    public BookingResponse processBooking(BookingRequest request) {
        String bookingCode = "TH-" + (1000 + new Random().nextInt(9000));
        Booking booking = new Booking(
            bookingCode,
            request.getFullName(),
            request.getPhone(),
            request.getRoomType(),
            request.getRentalType(),
            request.getCheckInDate(),
            request.getCheckInTime(),
            request.getNote()
        );

        // Add to top of list
        bookings.addFirst(booking);
        saveBookingsToFile();

        String message = "Cảm ơn quý khách " + request.getFullName() + 
                         "! Nhà nghỉ Trung Hiếu đã lưu yêu cầu đặt phòng (" + bookingCode + 
                         "). Quý khách có thể bấm 'Nhắn Zalo' để bác chủ nhà giữ phòng ngay lập tức.";
        return new BookingResponse(true, message, bookingCode, "https://zalo.me/0962192381");
    }

    public List<Booking> getAllBookings() {
        return new ArrayList<>(bookings);
    }

    public boolean updateBookingStatus(String id, String newStatus) {
        for (Booking b : bookings) {
            if (b.getId().equalsIgnoreCase(id)) {
                b.setStatus(newStatus);
                saveBookingsToFile();
                return true;
            }
        }
        return false;
    }

    public boolean deleteBooking(String id) {
        boolean removed = bookings.removeIf(b -> b.getId().equalsIgnoreCase(id));
        if (removed) {
            saveBookingsToFile();
        }
        return removed;
    }

    public Map<String, Object> getStats() {
        Map<String, Object> stats = new HashMap<>();
        long total = bookings.size();
        long pending = bookings.stream().filter(b -> "CHỜ XÁC NHẬN".equalsIgnoreCase(b.getStatus())).count();
        long confirmed = bookings.stream().filter(b -> "ĐÃ LIÊN HỆ".equalsIgnoreCase(b.getStatus()) || "ĐÃ NHẬN PHÒNG".equalsIgnoreCase(b.getStatus())).count();
        
        stats.put("total", total);
        stats.put("pending", pending);
        stats.put("confirmed", confirmed);
        stats.put("rating", "4.4");
        return stats;
    }
}
