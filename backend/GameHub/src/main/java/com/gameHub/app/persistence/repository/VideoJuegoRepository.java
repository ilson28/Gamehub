package com.gameHub.app.persistence.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.gameHub.app.persistence.entity.VideoJuego;

import java.util.List;

public interface VideoJuegoRepository extends JpaRepository<VideoJuego, Integer> {

    @Override
    @Query("SELECT v FROM VideoJuego v where v.activo = 1")
    List<VideoJuego> findAll();

    @Query("SELECT count(v) FROM VideoJuego v where v.activo = 1")
    Long totalVideojuegos();

    @Query("SELECT COALESCE(SUM(v.stock), 0) FROM VideoJuego v where v.activo = 1")
    Long TotalStock();
}
