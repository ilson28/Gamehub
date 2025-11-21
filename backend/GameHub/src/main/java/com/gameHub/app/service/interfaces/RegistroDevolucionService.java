package com.gameHub.app.service.interfaces;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import com.gameHub.app.persistence.entity.RegistroDevolucion;
import com.gameHub.app.presentation.dto.RegistroDevolucionDto;

public interface RegistroDevolucionService {

    List<RegistroDevolucionDto> findAll();

    Optional<RegistroDevolucionDto> findById(Integer id);

    RegistroDevolucionDto save(RegistroDevolucionDto devolucion);

    void delete(Integer id);

    List<RegistroDevolucionDto> filtrar(String cedula, LocalDateTime fromDate, LocalDateTime toDate);

}
