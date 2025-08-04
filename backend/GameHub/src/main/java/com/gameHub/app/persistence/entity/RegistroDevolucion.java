/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.gameHub.app.persistence.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.time.Period;

import org.hibernate.annotations.CreationTimestamp;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Setter
@Getter
@Entity
@Table(name = "registro_dev")
public class RegistroDevolucion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne
    @JoinColumn(name = "id_trans")
    private Transaccion transaccion;

    @CreationTimestamp
    private LocalDateTime fecha;

    public double[] calcularAdicion() {

        double ad = 0.0;
        double porcentaje = 0;
        Period lapsus = Period.between(getTransaccion().getFechaDev(), getFecha().toLocalDate());
        int dias = lapsus.getDays();
        if (dias >= 10) {
            porcentaje = 20;
            ad = this.getTransaccion().getTotal() * porcentaje / 100;
        } else if (dias >= 5) {
            porcentaje = 10;
            ad = this.getTransaccion().getTotal() * porcentaje / 100;

        } else if (dias > 2) {
            porcentaje = 5;
            ad = this.getTransaccion().getTotal() * porcentaje / 100;
        }

        return new double[] { dias, porcentaje, ad };
    }

}
