package com.gameHub.app.persistence.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.gameHub.app.persistence.entity.Imagen;

@Repository
public interface ImagenRepository extends JpaRepository<Imagen, Long> {

}
