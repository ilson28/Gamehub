package com.gameHub.app.presentation.controller;

import com.gameHub.app.presentation.dto.AuthResponse;
import com.gameHub.app.presentation.dto.ClienteDto;
import com.gameHub.app.presentation.dto.LoginRequest;
import com.gameHub.app.service.interfaces.AuthService;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {

        return ResponseEntity.ok(authService.login(request));

    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody @Valid ClienteDto newCliente) {

        return ResponseEntity.ok(authService.register(newCliente));

    }

}
