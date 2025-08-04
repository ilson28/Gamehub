package com.gameHub.app.service.implementation;

import com.gameHub.app.persistence.entity.Cliente;
import com.gameHub.app.persistence.repository.ClienteRepository;
import com.gameHub.app.presentation.dto.AuthResponse;
import com.gameHub.app.presentation.dto.ClienteDto;
import com.gameHub.app.presentation.dto.LoginRequest;
import com.gameHub.app.service.interfaces.AuthService;
import com.gameHub.app.service.interfaces.JwtService;
import com.gameHub.app.util.mapper.ClienteMapper;

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
    private ClienteRepository clienteRepository;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public AuthResponse login(LoginRequest request) {

        this.manager.authenticate(
                new UsernamePasswordAuthenticationToken(request.username(), request.password()));

        Cliente cliente = this.clienteRepository.findByUsername(request.username()).orElseThrow(
                () -> new UsernameNotFoundException("No se encontré al usuario"));

        var token = jwtService.generateToken(cliente);

        return new AuthResponse(token);
    }

    @Override
    public AuthResponse register(ClienteDto clienteDto) {

        Cliente newCliente = ClienteMapper.INSTANCE.toCliente(clienteDto);

        newCliente.setPassword(this.passwordEncoder.encode(clienteDto.getPassword()));
        this.clienteRepository.save(newCliente);

        var token = jwtService.generateToken(newCliente);
        // System.out.println("generate key -> "+ token);

        return new AuthResponse(token);
    }
}
