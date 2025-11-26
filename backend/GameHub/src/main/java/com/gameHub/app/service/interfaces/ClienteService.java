package com.gameHub.app.service.interfaces;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.gameHub.app.presentation.dto.ClienteDto;
import com.gameHub.app.service.implementation.ClienteResponseDto;

import java.util.List;
import java.util.Optional;

public interface ClienteService {

    Page<ClienteResponseDto> findAllPageable(Pageable pageable);

    List<ClienteResponseDto> findAll();

    Optional<ClienteResponseDto> findById(Integer id);

    ClienteResponseDto save(ClienteDto cliente);

    void delete(Integer id);
}
