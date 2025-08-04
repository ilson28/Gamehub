package com.gameHub.app.service.interfaces;

import org.springframework.data.domain.Pageable;

import com.gameHub.app.presentation.dto.ClienteDto;

import java.util.List;
import java.util.Optional;

public interface ClienteService {

    List<ClienteDto> findAllPageable(Pageable pageable);

    List<ClienteDto> findAll();

    Optional<ClienteDto> findById(Integer id);

    ClienteDto save(ClienteDto cliente);

    void delete(Integer id);
}
