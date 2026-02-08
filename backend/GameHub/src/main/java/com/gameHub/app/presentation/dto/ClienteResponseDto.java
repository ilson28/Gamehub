package com.gameHub.app.presentation.dto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class ClienteResponseDto {

    private Integer cedula;
    private String nombre, apellido, direccion, telefono;

}
