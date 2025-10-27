package com.gameHub.app.util.mapper;

import com.gameHub.app.persistence.entity.Transaccion;
import com.gameHub.app.presentation.dto.TransaccionRequestDto;
import com.gameHub.app.presentation.dto.TransaccionResponseDto;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface TransaccionMapper {

    TransaccionMapper INSTANCE = Mappers.getMapper(TransaccionMapper.class);

    // Versión ligera (por defecto, sin transJuegos)
    @Mapping(target = "transJuegos", ignore = true)
    TransaccionResponseDto toTransaccionDto(Transaccion transaccion);

    // Versión completa (incluye los transJuegos)
    @Mapping(target = "transJuegos", source = "transJuegos")
    TransaccionResponseDto toTransaccionDtoConJuegos(Transaccion transaccion);

    // ESTO FUNCIONA, NO HACE FALTA CREAR UN MAPPER PERSONALIZADO PARA TRANS_JUEGO
    // Trans_juegoDto toTransjuegoDto(Trans_juego transjuego);

    Transaccion toTransaccion(TransaccionRequestDto transaccion);
}
