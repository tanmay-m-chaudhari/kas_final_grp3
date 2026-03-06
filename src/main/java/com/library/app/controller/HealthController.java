package com.library.app.controller;

import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.Map;

@RestController
public class HealthController {
    @GetMapping("/health")
    public Map<String, Object> health() {
        return Map.of("status", "UP", "service", "library-app", "timestamp", LocalDateTime.now().toString());
    }
}
