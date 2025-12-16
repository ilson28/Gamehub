package com.gameHub.app.service.interfaces;

import com.gameHub.app.persistence.entity.Usuario;
import com.gameHub.app.presentation.dto.AuthResponse;
import com.gameHub.app.presentation.dto.LoginRequest;

public interface AuthService {

    AuthResponse login(LoginRequest loginRequest);

    AuthResponse register(Usuario usuario);
}
