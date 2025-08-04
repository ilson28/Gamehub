/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.gameHub.app.persistence.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.validation.annotation.Validated;

import com.gameHub.app.util.enums.Plataforma;

@Setter
@Getter
@Entity
@Builder
@Validated
@NoArgsConstructor
@AllArgsConstructor
public class VideoJuego {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private Integer activo, stock;

    // private String plataforma;
    @Enumerated(EnumType.STRING)
    private Plataforma plataforma;
    private String titulo, genero;

    @Column(name = "p_alquiler")
    private double precioAlquiler;

    @Column(name = "p_venta")
    private double precioVenta;

    private String imagen;

}
