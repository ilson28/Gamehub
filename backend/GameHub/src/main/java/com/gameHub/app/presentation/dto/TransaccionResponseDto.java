package com.gameHub.app.presentation.dto;

import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;

public class TransaccionResponseDto {
    private Integer id;

    private String tipo;
    private String estado;
    private double total;
    private LocalDate fechaTrans;
    private LocalTime hora;
    private LocalDate fechaDev;
    private ClienteDto cliente;

}
