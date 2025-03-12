package org.example.yogabusinessmanagementweb.service.Impl;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
public class RedisTokenService {
    private final StringRedisTemplate redisTemplate;

    public RedisTokenService(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    // Lưu refresh token vào Redis khi người dùng đăng xuất
    public void addToBlacklist(String refreshToken, long expirationMinutes) {
        redisTemplate.opsForValue().set(refreshToken, "blacklisted", expirationMinutes, TimeUnit.MINUTES);
    }

    // Kiểm tra xem refresh token có bị blacklist không
    public boolean isBlacklisted(String refreshToken) {
        return redisTemplate.hasKey(refreshToken);
    }
}
