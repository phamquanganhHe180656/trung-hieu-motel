package com.trunghieu.motel.controller;

import com.trunghieu.motel.service.MotelService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    private final MotelService motelService;

    @Value("${motel.name:Nhà Nghỉ Trung Hiếu}")
    private String motelName;

    @Value("${motel.tagline}")
    private String tagline;

    @Value("${motel.address}")
    private String address;

    @Value("${motel.phone}")
    private String phone;

    @Value("${motel.zalo}")
    private String zalo;

    @Value("${motel.google-maps-url}")
    private String googleMapsUrl;

    @Value("${motel.rating:4.4}")
    private String rating;

    public HomeController(MotelService motelService) {
        this.motelService = motelService;
    }

    @GetMapping("/")
    public String index(Model model) {
        model.addAttribute("motelName", motelName);
        model.addAttribute("tagline", tagline);
        model.addAttribute("address", address);
        model.addAttribute("phone", phone);
        model.addAttribute("phoneClean", phone.replaceAll("\\s+", ""));
        model.addAttribute("zalo", zalo);
        model.addAttribute("googleMapsUrl", googleMapsUrl);
        model.addAttribute("rating", rating);
        model.addAttribute("rooms", motelService.getAllRooms());
        return "index";
    }
}
