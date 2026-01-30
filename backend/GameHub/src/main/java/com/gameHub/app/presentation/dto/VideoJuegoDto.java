/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.gameHub.app.presentation.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.gameHub.app.util.enums.Plataforma;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VideoJuegoDto {

    private Integer id;

    @Min(value = 1)
    private Integer stock;

    @NotNull
    private Plataforma plataforma;

    @NotBlank
    private String titulo, genero;

    @Min(value = 30000)
    private double precioAlquiler;

    @Min(value = 30000)
    private double precioVenta;

    private String imagen;

    // Campo adicional solo para el frontend
    public String getImagenUrl() {
        if (imagen == null || imagen.isBlank())
            return null;
        return "https://gamehub-yqz0.onrender.com/api/images/" + imagen;
    }

}
