package com.gameHub.app.persistence.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Setter
@Getter
@Entity
public class Trans_juego {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private int cant;
    private double total;

    @ManyToOne(targetEntity = VideoJuego.class)
    @JoinColumn(name = "id_juego")
    private VideoJuego videoJuego;

    @JsonIgnore
    @JoinColumn(name = "id_trans")
    @ManyToOne(targetEntity = Transaccion.class)
    private Transaccion transaccion;

}
