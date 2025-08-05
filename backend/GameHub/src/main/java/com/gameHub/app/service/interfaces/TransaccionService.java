package com.gameHub.app.service.interfaces;

import com.gameHub.app.persistence.entity.Transaccion;
import com.gameHub.app.presentation.dto.TransaccionRequestDto;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface TransaccionService {

    List<TransaccionRequestDto> findAll();

    List<TransaccionRequestDto> findAllOrderByIdDesc();

    List<Transaccion> findAllWithTransJuego();

    List<TransaccionRequestDto> findByIdCliente(Integer id);

    List<TransaccionRequestDto> findByTipo(String tipo, LocalDate fecha);

    List<TransaccionRequestDto> findAlquilerByEstado(String estado, LocalDate fecha);

    Long totalActiveAlquilerTransaccions();

    Long totalSalesToday();

    TransaccionRequestDto save(TransaccionRequestDto transaccion);

    Optional<TransaccionRequestDto> findById(Integer id);

    void delete(Integer id);

}
