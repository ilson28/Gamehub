/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.gameHub.app.presentation.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransaccionDto {

    private Integer id;

    @NotBlank
    private String tipo;

    @NotBlank
    private String estado;

    private double total;

    private LocalDate fechaTrans;

    @NotNull
    @Future
    private LocalDate fechaDev;

    private LocalTime hora;

    @Valid
    private ClienteDto cliente;

    @NotEmpty
    @Valid
    private List<Trans_juegoDto> transJuegos;

}
