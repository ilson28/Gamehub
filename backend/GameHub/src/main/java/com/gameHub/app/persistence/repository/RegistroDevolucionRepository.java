package com.gameHub.app.persistence.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.gameHub.app.persistence.entity.RegistroDevolucion;

public interface RegistroDevolucionRepository extends JpaRepository<RegistroDevolucion, Integer> {

    @Query("""
            SELECT r
            FROM RegistroDevolucion r
            JOIN r.transaccion t
            JOIN t.cliente c
            WHERE (:cedula IS NULL OR c.cedula = :cedula)
            AND (:fromDate IS NULL OR r.fecha >= :fromDate)
            AND (:toDate IS NULL OR r.fecha <= :toDate)
            """)
    List<RegistroDevolucion> filtrar(
            @Param("cedula") String cedula,
            @Param("fromDate") LocalDateTime fromDate,
            @Param("toDate") LocalDateTime toDate);
}
