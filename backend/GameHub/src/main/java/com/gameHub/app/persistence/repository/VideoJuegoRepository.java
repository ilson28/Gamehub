package com.gameHub.app.persistence.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.gameHub.app.persistence.entity.VideoJuego;

import java.util.List;

public interface VideoJuegoRepository extends JpaRepository<VideoJuego, Integer> {

    @Query("SELECT v FROM VideoJuego v where v.activo = 1 " +
            "AND (:titulo IS NULL OR LOWER(v.titulo) LIKE LOWER(CONCAT('%', :name, '%')))")
    List<VideoJuego> findAllGames(String titulo);

    @Query("SELECT count(v) FROM VideoJuego v where v.activo = 1")
    Long totalVideojuegos();

    @Query("SELECT COALESCE(SUM(v.stock), 0) FROM VideoJuego v where v.activo = 1")
    Long TotalStock();

    @Modifying
    @Query("UPDATE VideoJuego v SET v.stock = :newStock WHERE v.id = :id")
    int updateStock(int id, int newStock);

}
