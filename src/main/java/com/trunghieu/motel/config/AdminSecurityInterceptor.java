package com.trunghieu.motel.config;

import com.trunghieu.motel.service.AdminAuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class AdminSecurityInterceptor implements HandlerInterceptor {

    private final AdminAuthService adminAuthService;

    public AdminSecurityInterceptor(AdminAuthService adminAuthService) {
        this.adminAuthService = adminAuthService;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String uri = request.getRequestURI();

        // Allow public admin login/logout
        if (uri.equals("/admin/login") || uri.equals("/admin/logout")) {
            return true;
        }

        // Check authentication
        if (adminAuthService.isAuthenticated(request)) {
            return true;
        }

        // Block unauthorized access
        if (uri.startsWith("/api/admin")) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write("{\"error\": \"Unauthorized. Yêu cầu mã PIN hoặc mật khẩu quản trị viên!\"}");
            return false;
        }

        // Redirect browser to login page
        response.sendRedirect("/admin/login");
        return false;
    }
}
