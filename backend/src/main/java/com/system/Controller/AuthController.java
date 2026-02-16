package com.system.Controller;

import com.system.Model.User;
import com.system.Service.SeaTableService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * AuthController
 * Handles authentication-related endpoints.
 * - POST /api/auth - Authenticate user
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final SeaTableService seaTableService;

    public AuthController(SeaTableService seaTableService) {
        this.seaTableService = seaTableService;
    }

    /**
     * POST /api/auth
     * Authenticates a user with username and password.
     * @param credentials Map containing username and password
     * @return User object with token if authenticated, error message otherwise
     */
    @PostMapping
    public ResponseEntity<?> authenticate(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        if (username == null || username.isEmpty() || password == null || password.isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Username and password are required");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }

        User user = seaTableService.authenticate(username, password);

        if (user != null) {
            // Create response with user data and a simple token
            Map<String, String> response = new HashMap<>();
            response.put("username", user.getUsername());
            response.put("role", user.getRole());
            // Generate a simple token (in production, use JWT or proper session management)
            response.put("token", UUID.randomUUID().toString());
            return ResponseEntity.ok(response);
        } else {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Invalid credentials");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
    }
}
