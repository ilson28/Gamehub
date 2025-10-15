package com.gameHub.app.service.implementation;

import com.gameHub.app.persistence.entity.Cliente;
import com.gameHub.app.persistence.repository.ClienteRepository;
import com.gameHub.app.presentation.dto.ClienteDto;
import com.gameHub.app.service.exception.ResourceNotFoundException;
import com.gameHub.app.service.interfaces.ClienteService;
import com.gameHub.app.util.mapper.ClienteMapper;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ClienteServiceImpl implements ClienteService {

    private ClienteRepository clienteRepository;

    public ClienteServiceImpl(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    @Transactional(readOnly = true)
    @Override
    public List<ClienteResponseDto> findAllPageable(Pageable pageable) {

        return clienteRepository.findAll(pageable).stream()
                .map(ClienteMapper.INSTANCE::toClienteResponseDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    @Override
    public List<ClienteResponseDto> findAll() {
        // ModelMapper mapper = new ModelMapper();
        // mapper.getConfiguration().setPropertyCondition(ctx ->
        // Hibernate.isInitialized(ctx.getSource()));
        return clienteRepository.findAll().stream()
                .map(ClienteMapper.INSTANCE::toClienteResponseDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    @Override
    public Optional<ClienteResponseDto> findById(Integer id) {

        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente", "Id", id));
        ClienteResponseDto clienteResponseDto = ClienteMapper.INSTANCE.toClienteResponseDto(cliente);

        return Optional.ofNullable(clienteResponseDto);
    }

    @Transactional
    @Override
    public ClienteResponseDto save(ClienteDto clienteDto) {

        Cliente cliente = ClienteMapper.INSTANCE.toCliente(clienteDto);

        return ClienteMapper.INSTANCE.toClienteResponseDto(clienteRepository.save(cliente));
    }

    @Transactional
    @Override
    public void delete(Integer id) {

        Cliente cliente = ClienteMapper.INSTANCE.toCliente(this.findById(id).orElseThrow());
        clienteRepository.deleteById(cliente.getCedula());
    }
}
