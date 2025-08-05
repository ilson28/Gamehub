package com.gameHub.app.util.mapper;

import com.gameHub.app.persistence.entity.Transaccion;
import com.gameHub.app.presentation.dto.TransaccionRequestDto;

import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface TransaccionMapper {

    TransaccionMapper INSTANCE = Mappers.getMapper(TransaccionMapper.class);

    // @Mapping(target ="transJuegos",ignore =true)
    TransaccionRequestDto toTransaccionDto(Transaccion transaccion);

    // ESTO FUNCIONA, NO HACE FALTA CREAR UN MAPPER PERSONALIZADO PARA TRANS_JUEGO
    // @Mapping(target ="videoJuego",ignore =true)
    // Trans_juegoDto toTransjuegoDto(Trans_juego transjuego);

    Transaccion toTransaccion(TransaccionRequestDto transaccion);

}
