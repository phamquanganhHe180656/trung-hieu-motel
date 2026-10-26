package com.trunghieu.motel.service;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;

@Service
public class AdminAuthService {

    public static final String SESSION_KEY = "TRUNGHIEU_ADMIN_LOGGED_IN";
    private static final String SECRET_SALT = "TrungHieuMotel_S0nTay_2026_SecureKey";

    @Value("${admin.pin:192381}")
    private String adminPin;

    @Value("${admin.password:trunghieu@admin}")
    private String adminPassword;

    @Value("${admin.cookie-name:TRUNGHIEU_ADMIN_SESSION}")
    private String cookieName;

    @Value("${admin.remember-days:30}")
    private int rememberDays;

    public boolean checkCredentials(String input) {
        if (input == null || input.trim().isEmpty()) {
            return false;
        }
        String clean = input.trim();
        return clean.equals(adminPin.trim()) || clean.equalsIgnoreCase(adminPassword.trim());
    }

    public boolean authenticate(String input, boolean rememberMe, HttpServletRequest request, HttpServletResponse response) {
        if (!checkCredentials(input)) {
            return false;
        }

        // Set session
        HttpSession session = request.getSession(true);
        session.setAttribute(SESSION_KEY, true);

        // If remember me is checked or by default, issue secure persistent cookie
        if (rememberMe) {
            long expiryTime = System.currentTimeMillis() + ((long) rememberDays * 24 * 60 * 60 * 1000);
            String token = generateToken(expiryTime);
            Cookie cookie = new Cookie(cookieName, token);
            cookie.setPath("/");
            cookie.setHttpOnly(true);
            cookie.setMaxAge(rememberDays * 24 * 60 * 60);
            response.addCookie(cookie);
        }

        return true;
    }

    public boolean isAuthenticated(HttpServletRequest request) {
        // 1. Check HTTP Session
        HttpSession session = request.getSession(false);
        if (session != null && Boolean.TRUE.equals(session.getAttribute(SESSION_KEY))) {
            return true;
        }

        // 2. Check Remember-Me Cookie
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie c : cookies) {
                if (cookieName.equals(c.getName())) {
                    if (validateToken(c.getValue())) {
                        // Re-establish session
                        HttpSession newSession = request.getSession(true);
                        newSession.setAttribute(SESSION_KEY, true);
                        return true;
                    }
                }
            }
        }

        return false;
    }

    public void logout(HttpServletRequest request, HttpServletResponse response) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }

        Cookie cookie = new Cookie(cookieName, "");
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        cookie.setMaxAge(0);
        response.addCookie(cookie);
    }

    private String generateToken(long expiryTime) {
        String data = expiryTime + ":" + adminPin + ":" + SECRET_SALT;
        String hash = sha256(data);
        return expiryTime + "." + hash;
    }

    private boolean validateToken(String token) {
        if (token == null || !token.contains(".")) {
            return false;
        }
        try {
            String[] parts = token.split("\\.");
            if (parts.length != 2) return false;

            long expiryTime = Long.parseLong(parts[0]);
            if (System.currentTimeMillis() > expiryTime) {
                return false; // Expired
            }

            String expectedHash = sha256(expiryTime + ":" + adminPin + ":" + SECRET_SALT);
            return expectedHash.equals(parts[1]);
        } catch (Exception e) {
            return false;
        }
    }

    private String sha256(String text) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hashBytes = md.digest(text.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hashBytes);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 not supported", e);
        }
    }

    public String getAdminPin() {
        return adminPin;
    }
}
