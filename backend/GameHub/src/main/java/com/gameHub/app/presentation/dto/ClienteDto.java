/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.gameHub.app.presentation.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.validation.annotation.Validated;

import com.gameHub.app.util.enums.Role;

@Validated
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClienteDto {

    @NotNull
    @Positive
    private Integer cedula;

    @NotBlank
    @Size(min = 5, max = 15)
    private String password;

    @NotBlank
    private String nombre, apellido, direccion, telefono, sexo, username;

    @NotNull
    private Role role;

}
