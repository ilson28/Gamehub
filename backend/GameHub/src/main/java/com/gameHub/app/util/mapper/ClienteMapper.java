package com.gameHub.app.util.mapper;

import com.gameHub.app.persistence.entity.Cliente;
import com.gameHub.app.presentation.dto.ClienteDto;

import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface ClienteMapper {

    ClienteMapper INSTANCE = Mappers.getMapper(ClienteMapper.class);

    ClienteDto toClienteDto(Cliente cliente);

    Cliente toCliente(ClienteDto clienteDto);

}
