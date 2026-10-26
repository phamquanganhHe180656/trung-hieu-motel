package com.trunghieu.motel.controller;

import com.trunghieu.motel.model.BookingRequest;
import com.trunghieu.motel.model.BookingResponse;
import com.trunghieu.motel.service.MotelService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class BookingApiController {

    private final MotelService motelService;

    public BookingApiController(MotelService motelService) {
        this.motelService = motelService;
    }

    @PostMapping("/booking")
    public ResponseEntity<BookingResponse> createBooking(@Valid @RequestBody BookingRequest request,
                                                         BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            String firstError = bindingResult.getAllErrors().getFirst().getDefaultMessage();
            return ResponseEntity.badRequest().body(new BookingResponse(false, firstError, null, null));
        }

        BookingResponse response = motelService.processBooking(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/rooms")
    public ResponseEntity<?> getRooms() {
        return ResponseEntity.ok(motelService.getAllRooms());
    }

    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("OK - Trung Hieu Motel backend is running smoothly");
    }
}
