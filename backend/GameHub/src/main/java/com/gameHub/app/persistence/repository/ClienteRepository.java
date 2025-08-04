package com.gameHub.app.persistence.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gameHub.app.persistence.entity.Cliente;

import java.util.Optional;

public interface ClienteRepository extends JpaRepository<Cliente, Integer> {

    Optional<Cliente> findByUsername(String username);

    // @Query("SELECT c FROM Cliente c JOIN FETCH c.transaccions")
    // List<Cliente> findAllWithTransaccions();
}
