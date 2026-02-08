package com.gameHub.app.util.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.gameHub.app.persistence.entity.VideoJuego;
import com.gameHub.app.presentation.dto.VideoJuegoDto;

@Mapper(componentModel = "spring")
public interface VideoJuegoMapper {

    VideoJuego toEntity(VideoJuegoDto juegoDto);

    @Mapping(target = "imagenUrl", source = "imagen.imagenUrl")
    VideoJuegoDto toDto(VideoJuego juego);

}
