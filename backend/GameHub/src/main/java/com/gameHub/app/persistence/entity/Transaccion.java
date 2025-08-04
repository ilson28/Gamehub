/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.gameHub.app.persistence.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Entity
public class Transaccion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private int activo;
    private String tipo;
    private String estado;
    private double total;

    private LocalDate fechaDev;

    private LocalDate fechaTrans;
    private LocalTime hora;

    @ManyToOne(targetEntity = Cliente.class)
    @JoinColumn(name = "id_cliente")
    private Cliente cliente;

    // @JsonIgnore
    @OneToMany(targetEntity = Trans_juego.class, mappedBy = "transaccion", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Trans_juego> transJuegos;

    public double calcularTotal() {
        return getTransJuegos().stream().mapToDouble(Trans_juego::getTotal).sum();
    }

    @PrePersist
    public void prePersist() {
        this.fechaTrans = LocalDate.now();
        this.hora = LocalTime.now();
        // this.total = calcularTotal();
    }

}
