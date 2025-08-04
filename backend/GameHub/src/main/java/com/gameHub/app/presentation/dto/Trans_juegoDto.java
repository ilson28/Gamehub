package com.gameHub.app.presentation.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.validation.annotation.Validated;

@NoArgsConstructor
@AllArgsConstructor
@Validated
@Builder
@Data
public class Trans_juegoDto {

    private Integer id;

    @Positive
    private int cant;

    @Positive
    private double total;

    @Valid
    private VideoJuegoDto videoJuego;

}
