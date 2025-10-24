package com.gameHub.app.presentation.dto;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransaccionResponseDto {
    private Integer id;

    private String tipo;
    private String estado;
    private double total;
    private LocalDate fechaTrans;
    private LocalTime hora;
    private LocalDate fechaDev;
    private ClienteDto cliente;
    private List<Trans_juegoResponseDto> transjuegos;

}
