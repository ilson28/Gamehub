package com.gameHub.app.service.interfaces;

import com.gameHub.app.persistence.entity.Transaccion;
import com.gameHub.app.presentation.dto.TransaccionDto;

import java.util.List;
import java.util.Optional;

public interface TransaccionService {

    List<TransaccionDto> findAll();

    List<TransaccionDto> findAllOrderByIdDesc();

    List<Transaccion> findAllWithTransJuego();

    List<TransaccionDto> findByIdCliente(Integer id);

    Long totalActiveAlquilerTransaccions();

    Long totalSalesToday();

    TransaccionDto save(TransaccionDto transaccion);

    Optional<TransaccionDto> findById(Integer id);

    void delete(Integer id);

}
