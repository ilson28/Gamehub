
package com.gameHub.app.presentation.dto;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegistroDevolucionDto {

    private Integer id;

    @Valid
    private TransaccionRequestDto transaccion;
    private LocalDateTime fecha;

}
