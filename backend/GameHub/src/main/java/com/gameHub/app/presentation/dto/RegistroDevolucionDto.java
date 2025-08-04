
package com.gameHub.app.presentation.dto;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegistroDevolucionDto {

    private Integer id;

    @Valid
    private TransaccionDto transaccion;
    private LocalDate fecha;
    private LocalTime hora;

}
