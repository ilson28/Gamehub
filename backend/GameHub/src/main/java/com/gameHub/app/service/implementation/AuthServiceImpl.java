package com.gameHub.app.service.implementation;

import com.gameHub.app.persistence.entity.Usuario;
import com.gameHub.app.persistence.repository.UsuarioRepository;
import com.gameHub.app.presentation.dto.AuthResponse;
import com.gameHub.app.presentation.dto.LoginRequest;
import com.gameHub.app.service.interfaces.AuthService;
import com.gameHub.app.service.interfaces.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private AuthenticationManager manager;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public AuthResponse login(LoginRequest request) {

        this.manager.authenticate(
                new UsernamePasswordAuthenticationToken(request.username(), request.password()));

        Usuario user = this.usuarioRepository.findByUsername(request.username()).orElseThrow(
                () -> new UsernameNotFoundException("No se encontré al usuario"));

        var token = jwtService.generateToken(user);

        return new AuthResponse(token);
    }

    @Override
    public AuthResponse register(Usuario usuario) {

        usuario.setPassword(this.passwordEncoder.encode(usuario.getPassword()));
        this.usuarioRepository.save(usuario);

        var token = jwtService.generateToken(usuario);
        // System.out.println("generate key -> "+ token);

        return new AuthResponse(token);
    }
}
