package com.gameHub.app.service.interfaces;

import com.gameHub.app.persistence.entity.Transaccion;
import com.gameHub.app.presentation.dto.TransaccionRequestDto;
import com.gameHub.app.presentation.dto.TransaccionResponseDto;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface TransaccionService {

    List<TransaccionResponseDto> findAll();

    List<TransaccionResponseDto> findAllOrderByIdDesc();

    List<Transaccion> findAllWithTransJuego();

    List<TransaccionResponseDto> findByIdCliente(Integer id);

    List<TransaccionResponseDto> findByTipo(String tipo, LocalDate fecha);

    List<TransaccionResponseDto> findAlquilerByEstado(String estado, LocalDate fecha);

    Long totalActiveAlquilerTransaccions();

    Long totalSalesToday();

    TransaccionResponseDto save(TransaccionRequestDto transaccion);

    Optional<TransaccionResponseDto> findById(Integer id);

    void delete(Integer id);

}
