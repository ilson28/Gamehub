package com.gameHub.app.persistence.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.gameHub.app.persistence.entity.Transaccion;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TransaccionRepository extends JpaRepository<Transaccion, Integer> {

        @Query("SELECT t FROM Transaccion t WHERE t.cliente.cedula = :cedula ")
        List<Transaccion> findByIdCliente(@Param("cedula") Integer cedula);

        List<Transaccion> findByOrderByIdDesc();

        @Query("SELECT t FROM Transaccion t JOIN FETCH t.transJuegos")
        List<Transaccion> findAllWithTransJuego();

        @Query("SELECT COUNT(t) FROM Transaccion t WHERE t.tipo = 'alquiler' AND t.estado = 'activo' AND t.activo = 1")
        Long totalActiveAlquilerTransaccions();

        @Query("SELECT COUNT(t) FROM Transaccion t WHERE t.tipo = 'venta' AND t.activo = 1 AND t.fechaTrans = :today")
        Long totalSalesToday(LocalDate today);

        @Query("SELECT t FROM Transaccion t WHERE t.activo = 1 " +
                        "AND t.tipo = :tipo " +
                        "AND (:fecha IS NULL OR t.fechaTrans = :fecha)")
        List<Transaccion> findByTipo(String tipo, LocalDate fecha);

        @Query("SELECT t FROM Transaccion t WHERE t.activo = 1 AND t.tipo = 'alquiler' " +
                        "AND t.estado = :estado " +
                        "AND (:fecha IS NULL OR t.fechaTrans = :fecha)")
        List<Transaccion> findAlquilerByEstado(String estado, LocalDate fecha);

}
