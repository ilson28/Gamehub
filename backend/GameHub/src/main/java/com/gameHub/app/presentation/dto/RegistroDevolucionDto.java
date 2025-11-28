
package com.gameHub.app.presentation.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegistroDevolucionDto {

    private Integer id;
    @NotNull
    @Positive
    private Integer idTransaccion;
    private TransaccionResponseDto transaccion;
    private LocalDate fecha;

}
