# 🏨 Website Quảng Cáo Nhà Nghỉ Trung Hiếu - Sơn Tây, Hà Nội

Dự án website giới thiệu & quảng cáo tối giản, sang trọng cho **Nhà Nghỉ Trung Hiếu**, được thiết kế chuyên biệt để **gắn trực tiếp vào mục "Trang web" trên hồ sơ Google Maps / Google Business Profile**.

---

## 📌 1. Thông Tin Trích Xuất Từ Google Maps
- **Tên cơ sở:** Nhà Nghỉ Trung Hiếu (Nhà Nghỉ Trung hiếu)
- **Link Google Maps chính thức:** [https://maps.app.goo.gl/zPP6jYdYyocacx5a6](https://maps.app.goo.gl/zPP6jYdYyocacx5a6)
- **Địa chỉ:** Số 202, Ngõ 178, Phường Xuân Khanh, Thị Xã Sơn Tây, Hà Nội *(Khu vực Tùng Thiện - Xuân Khanh, Sơn Tây)*
- **Mã Plus Code:** `4C5X+XR Tùng Thiện, Sơn Tây, Hà Nội`
- **Tọa độ GPS:** `21.1098834, 105.449566`
- **Hotline / Zalo:** `0962 192 381`
- **Đánh giá Google Maps:** 4.4 / 5.0 sao

---

## 🎨 2. Điểm Nhấn Thiết Kế Tối Giản (Minimalist & Modern)
- **Phong cách Tối giản (Minimalist / Japandi Warm):** Màu sắc trang nhã, phông chữ cao cấp, tạo cảm giác thư thái, sạch sẽ và an tâm cho khách hàng đang tìm phòng.
- **Tối ưu trải nghiệm cho khách vào từ Google Maps:**
  - 📞 **Nút Gọi điện 1 chạm** (`tel:0962192381`)
  - 🗺️ **Nút Mở Chỉ đường Google Maps** tự động kích hoạt ứng dụng Google Maps dẫn đường tới tận ngõ nhà nghỉ
  - 💬 **Nút Nhắn tin Zalo trực tiếp** (`https://zalo.me/0962192381`)
  - 📋 **Form đặt phòng & giữ phòng nhanh** gửi qua REST API backend của Java
  - 📱 **Thanh điều hướng nhanh cố định trên Mobile (Sticky Action Bar)** giúp người dùng điện thoại thao tác ngay lập tức mà không cần cuộn trang

---

## ☕ 3. Công Nghệ & Cấu Trúc Mã Nguồn (Java Spring Boot)
Dự án được xây dựng với ngôn ngữ chính là **Java 21**, nền tảng **Spring Boot 3.3.4** và **Maven**:

```text
d:/projectQA2/
├── pom.xml                                    # Cấu hình dự án Maven & dependencies
├── run.bat                                    # File chạy nhanh trên Windows
├── src/
│   ├── main/
│   │   ├── java/com/trunghieu/motel/
│   │   │   ├── TrungHieuMotelApplication.java # Class khởi chạy Spring Boot
│   │   │   ├── controller/
│   │   │   │   ├── HomeController.java        # Controller hiển thị giao diện Thymeleaf
│   │   │   │   └── BookingApiController.java  # REST API tiếp nhận & xử lý đặt phòng
│   │   │   ├── model/
│   │   │   │   ├── RoomInfo.java              # Đối tượng thông tin phòng
│   │   │   │   ├── BookingRequest.java        # DTO tiếp nhận dữ liệu khách đặt
│   │   │   │   └── BookingResponse.java       # DTO phản hồi kết quả
│   │   │   └── service/
│   │   │       └── MotelService.java          # Nghiệp vụ xử lý đặt phòng và dữ liệu
│   │   └── resources/
│   │       ├── application.properties         # Cấu hình port 8080, thông tin hotline, địa chỉ
│   │       ├── templates/
│   │       │   └── index.html                 # Giao diện chính Thymeleaf
│   │       └── static/
│   │           ├── index.html                 # Bản HTML tĩnh độc lập (sẵn sàng up hosting)
│   │           ├── css/style.css              # Hệ thống CSS phong cách tối giản
│   │           ├── js/main.js                 # Xử lý AJAX và hiệu ứng tương tác
│   │           └── images/                    # Hình ảnh phòng thực tế chất lượng cao
```

---

## 🚀 4. Hướng Dẫn Khởi Chạy

### Cách 1: Chạy bằng file `run.bat`
Click đúp chuột vào file `run.bat` trong thư mục dự án.

### Cách 2: Chạy bằng lệnh Maven
Mở Terminal/PowerShell tại thư mục `d:\projectQA2`:
```bash
mvn spring-boot:run
```
Sau đó truy cập trình duyệt tại: **`http://localhost:8080`**

### Cách 3: Đóng gói thành file `.jar` độc lập
```bash
mvn clean package -DskipTests
java -jar target/trung-hieu-motel-1.0.0.jar
```

---

## 📍 5. Hướng Dẫn Gắn Link Lên Google Maps Profile

1. Mở ứng dụng **Google Maps** hoặc truy cập [Google Doanh Nghiệp (Google Business Profile)](https://business.google.com).
2. Đăng nhập tài khoản quản trị địa điểm **Nhà Nghỉ Trung hiếu**.
3. Chọn **Chỉnh sửa hồ sơ (Edit profile)** > chọn **Thông tin doanh nghiệp (Business information)**.
4. Tìm mục **Trang web (Website)**:
   - Nhập đường link website của nhà nghỉ (sau khi bạn đưa lên hosting/tên miền của bạn, ví dụ: `https://nhanghitrunghieu.com` hoặc link Vercel/Cloudflare miễn phí).
5. Bấm **Lưu (Save)**. Google sẽ hiển thị nút "Trang web" trực tiếp trên bản đồ để khách hàng bấm vào!
