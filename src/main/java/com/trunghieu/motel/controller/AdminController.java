package com.trunghieu.motel.controller;

import com.trunghieu.motel.model.Booking;
import com.trunghieu.motel.service.AdminAuthService;
import com.trunghieu.motel.service.MotelService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Controller
public class AdminController {

    private final MotelService motelService;
    private final AdminAuthService adminAuthService;

    @Value("${motel.name:Nhà Nghỉ Trung Hiếu}")
    private String motelName;

    @Value("${motel.phone:0962 192 381}")
    private String phone;

    public AdminController(MotelService motelService,
                           AdminAuthService adminAuthService) {
        this.motelService = motelService;
        this.adminAuthService = adminAuthService;
    }

    @GetMapping("/admin/login")
    public String loginPage(HttpServletRequest request, Model model) {
        if (adminAuthService.isAuthenticated(request)) {
            return "redirect:/admin";
        }
        model.addAttribute("motelName", motelName);
        model.addAttribute("hotline", phone);
        return "admin-login";
    }

    @PostMapping("/admin/login")
    public String handleLogin(@RequestParam("pin") String pin,
                              @RequestParam(value = "rememberMe", defaultValue = "false") boolean rememberMe,
                              HttpServletRequest request,
                              HttpServletResponse response,
                              Model model) {
        boolean success = adminAuthService.authenticate(pin, rememberMe, request, response);
        if (success) {
            return "redirect:/admin";
        }

        model.addAttribute("motelName", motelName);
        model.addAttribute("hotline", phone);
        model.addAttribute("errorMessage", "Mã PIN hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại!");
        return "admin-login";
    }

    @GetMapping("/admin/logout")
    public String handleLogout(HttpServletRequest request, HttpServletResponse response) {
        adminAuthService.logout(request, response);
        return "redirect:/admin/login";
    }

    @GetMapping("/admin")
    public String adminPage(Model model) {
        model.addAttribute("motelName", motelName);
        model.addAttribute("hotline", phone);
        model.addAttribute("stats", motelService.getStats());
        model.addAttribute("bookings", motelService.getAllBookings());
        return "admin";
    }

    @PostMapping("/admin/status")
    public String updateStatus(@RequestParam("id") String id, @RequestParam("status") String status) {
        motelService.updateBookingStatus(id, status);
        return "redirect:/admin";
    }

    @PostMapping("/admin/delete")
    public String deleteBooking(@RequestParam("id") String id) {
        motelService.deleteBooking(id);
        return "redirect:/admin";
    }

    // REST API for Live Polling & Asynchronous Actions
    @ResponseBody
    @GetMapping("/api/admin/bookings")
    public ResponseEntity<List<Booking>> getLiveBookings() {
        return ResponseEntity.ok(motelService.getAllBookings());
    }

    @ResponseBody
    @GetMapping("/api/admin/stats")
    public ResponseEntity<Map<String, Object>> getLiveStats() {
        return ResponseEntity.ok(motelService.getStats());
    }

    @ResponseBody
    @PostMapping("/api/admin/bookings/{id}/status")
    public ResponseEntity<?> updateLiveStatus(@PathVariable("id") String id, @RequestBody Map<String, String> body) {
        String newStatus = body.getOrDefault("status", "ĐÃ LIÊN HỆ");
        boolean ok = motelService.updateBookingStatus(id, newStatus);
        return ok ? ResponseEntity.ok(Map.of("success", true)) : ResponseEntity.badRequest().build();
    }

    @ResponseBody
    @DeleteMapping("/api/admin/bookings/{id}")
    public ResponseEntity<?> deleteLiveBooking(@PathVariable("id") String id) {
        boolean ok = motelService.deleteBooking(id);
        return ok ? ResponseEntity.ok(Map.of("success", true)) : ResponseEntity.badRequest().build();
    }

    @ResponseBody
    @GetMapping("/api/admin/zalo/info")
    public ResponseEntity<Map<String, String>> getZaloInfo() {
        return ResponseEntity.ok(Map.of(
            "hotline", phone,
            "zaloUrl", "https://zalo.me/0962192381",
            "motelName", motelName
        ));
    }
}
