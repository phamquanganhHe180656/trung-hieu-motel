package com.trunghieu.motel;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class TrungHieuMotelApplication {

    public static void main(String[] args) {
        SpringApplication.run(TrungHieuMotelApplication.class, args);
        System.out.println("==================================================");
        System.out.println(" Nhà Nghỉ Trung Hiếu - Website đang chạy tại:    ");
        System.out.println(" http://localhost:8080                            ");
        System.out.println(" Sẵn sàng gắn link vào Google Maps profile!      ");
        System.out.println("==================================================");
    }
}
