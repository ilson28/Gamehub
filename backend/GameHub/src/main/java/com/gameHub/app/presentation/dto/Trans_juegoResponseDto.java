package com.gameHub.app.presentation.dto;

import com.gameHub.app.persistence.entity.VideoJuego;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class Trans_juegoResponseDto {

    private Integer id;

    @Positive
    private int cant;

    private double total;

    @NotNull
    @Positive
    private Integer gameId;

    private VideoJuego videoJuego;

}
