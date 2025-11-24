package com.gameHub.app.service.interfaces;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springdoc.core.converters.models.Pageable;

import com.gameHub.app.presentation.dto.RegistroDevolucionDto;

public interface RegistroDevolucionService {

    Optional<RegistroDevolucionDto> findById(Integer id);

    RegistroDevolucionDto save(RegistroDevolucionDto devolucion);

    void delete(Integer id);

    List<RegistroDevolucionDto> findAll(String cedula, LocalDateTime fromDate, LocalDateTime toDate, Pageable pageable);

}
