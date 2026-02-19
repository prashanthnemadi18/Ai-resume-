package com.resumeai.controller;

import com.resumeai.dto.AuthRequest;
import com.resumeai.dto.AuthResponse;
import com.resumeai.dto.SignupRequest;
import com.resumeai.model.User;
import com.resumeai.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    
    private final AuthService authService;
    
    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@Valid @RequestBody SignupRequest request) {
        return ResponseEntity.ok(authService.signup(request));
    }
    
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
    
    @GetMapping("/me")
    public ResponseEntity<AuthResponse.UserDTO> getCurrentUser(Authentication authentication) {
        String userId = (String) authentication.getPrincipal();
        User user = authService.getCurrentUser(userId);
        return ResponseEntity.ok(AuthResponse.UserDTO.fromUser(user));
    }
}
