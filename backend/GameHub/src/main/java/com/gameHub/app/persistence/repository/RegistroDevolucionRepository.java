package com.gameHub.app.persistence.repository;

import java.time.LocalDate;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
                        WHERE (:cedula IS NULL OR c.cedula LIKE %:cedula%)
                        AND (:fromDate IS NULL OR r.fecha >= :fromDate)
                        AND (:toDate IS NULL OR r.fecha <= :toDate)
                        """)
        Page<RegistroDevolucion> findAllWithFilters(
                        @Param("cedula") String cedula,
                        @Param("fromDate") LocalDate fromDate,
                        @Param("toDate") LocalDate toDate,
                        Pageable pageable);

        @Query("SELECT COUNT(r) FROM RegistroDevolucion r")
        Long totalReturns();

        @Query("""
                        SELECT COUNT(r)
                        FROM RegistroDevolucion r
                        WHERE r.fecha BETWEEN :startOfMonth AND :endOfMonth
                        """)
        long countThisMonth(
                        @Param("startOfMonth") LocalDate startOfMonth,
                        @Param("endOfMonth") LocalDate endOfMonth);

        long countByFecha(LocalDate fecha);

}
