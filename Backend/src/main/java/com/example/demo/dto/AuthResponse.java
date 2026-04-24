package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    private String accessToken;
    private String refreshToken;
    private String fullName;
    /** ID user trong DB — frontend cần khi gọi POST /api/products (userId) */
    private Long userId;
    private String email;
}
