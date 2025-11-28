package com.gameHub.app.service.interfaces;

import java.time.LocalDate;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.gameHub.app.presentation.dto.RegistroDevolucionDto;

public interface RegistroDevolucionService {

    Optional<RegistroDevolucionDto> findById(Integer id);

    RegistroDevolucionDto save(RegistroDevolucionDto devolucion);

    void delete(Integer id);

    Page<RegistroDevolucionDto> findAll(String cedula, LocalDate fromDate, LocalDate toDate, Pageable pageable);

}
