package com.gameHub.app.util.mapper;

import com.gameHub.app.persistence.entity.Cliente;
import com.gameHub.app.presentation.dto.ClienteDto;
import com.gameHub.app.service.implementation.ClienteResponseDto;

import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface ClienteMapper {

    ClienteMapper INSTANCE = Mappers.getMapper(ClienteMapper.class);

    ClienteResponseDto toClienteResponseDto(Cliente cliente);

    Cliente toCliente(ClienteDto clienteDto);

    Cliente toCliente(ClienteResponseDto clienteDto);

}
