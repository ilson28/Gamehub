package com.gameHub.app.service.implementation;

import com.gameHub.app.persistence.entity.Cliente;
import com.gameHub.app.persistence.entity.Transaccion;
import com.gameHub.app.persistence.repository.ClienteRepository;
import com.gameHub.app.persistence.repository.TransaccionRepository;
import com.gameHub.app.persistence.repository.VideoJuegoRepository;
import com.gameHub.app.presentation.dto.TransaccionRequestDto;
import com.gameHub.app.presentation.dto.TransaccionResponseDto;
import com.gameHub.app.service.exception.ResourceNotFoundException;
import com.gameHub.app.service.interfaces.TransaccionService;
import com.gameHub.app.util.mapper.ClienteMapper;
import com.gameHub.app.util.mapper.TransaccionMapper;

import lombok.RequiredArgsConstructor;

import java.time.LocalDate;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransaccionServiceImpl implements TransaccionService {

    public final TransaccionRepository transaccionRepository;

    public final ClienteRepository clienteRepository;

    public final VideoJuegoRepository videoJuegoRepository;

    @Transactional(readOnly = true)
    @Override
    public List<TransaccionResponseDto> findAll() {

        return transaccionRepository.findAll().stream()
                .map(TransaccionMapper.INSTANCE::toTransaccionDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    @Override
    public List<TransaccionResponseDto> findAllOrderByIdDesc() {

        return transaccionRepository.findByOrderByIdDesc().stream()
                .map(TransaccionMapper.INSTANCE::toTransaccionDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<Transaccion> findAllWithTransJuego() {

        return transaccionRepository.findAllWithTransJuego();
    }

    @Transactional(readOnly = true)
    @Override
    public List<TransaccionResponseDto> findByIdCliente(Integer id) {

        clienteRepository.findById(id);
        return transaccionRepository.findByIdCliente(id).stream()
                .map(TransaccionMapper.INSTANCE::toTransaccionDto)
                .collect(Collectors.toList());
    }

    @Transactional
    @Override
    public TransaccionResponseDto save(TransaccionRequestDto transaccionDto) {

        Cliente cliente = null;
        Optional<Cliente> clienteOptional = this.clienteRepository.findById(transaccionDto.getCliente().getCedula());

        cliente = clienteOptional.orElseGet(
                () -> this.clienteRepository.save(ClienteMapper.INSTANCE.toCliente(transaccionDto.getCliente())));

        transaccionDto.getTransJuegos().stream().forEach(trans -> {
            trans.setVideoJuego(this.videoJuegoRepository.findById(trans.getGameId())
                    .orElseThrow(
                            () -> new ResourceNotFoundException("Videjuego not found with id " + trans.getGameId())));
        });

        Transaccion transaccion = TransaccionMapper.INSTANCE.toTransaccion(transaccionDto);
        transaccion.getTransJuegos().forEach(t -> t.setTransaccion(transaccion));
        transaccion.setCliente(cliente);

        return TransaccionMapper.INSTANCE.toTransaccionDto(transaccionRepository.save(transaccion));
    }

    @Transactional(readOnly = true)
    @Override
    public Optional<TransaccionResponseDto> findById(Integer id) {

        return Optional.ofNullable(TransaccionMapper.INSTANCE
                .toTransaccionDto(transaccionRepository.findById(id)
                        .orElseThrow(() -> new ResourceNotFoundException("Transaccion", "Id", id))));
    }

    @Transactional
    @Override
    public void delete(Integer id) {
        Transaccion transaccion = transaccionRepository.findById(id).get();
        transaccionRepository.delete(transaccion);

    }

    @Override
    public Long totalActiveAlquilerTransaccions() {

        return this.transaccionRepository.totalActiveAlquilerTransaccions();
    }

    @Override
    public Long totalSalesToday() {
        return this.transaccionRepository.totalSalesToday(LocalDate.now());
    }

    @Override
    public List<TransaccionResponseDto> findByTipo(String tipo, LocalDate fecha) {

        return transaccionRepository.findByTipo(tipo, fecha).stream()
                .map(TransaccionMapper.INSTANCE::toTransaccionDtoConJuegos)
                .collect(Collectors.toList());
    }

    @Override
    public List<TransaccionResponseDto> findAlquilerByEstado(String estado, LocalDate fecha) {

        return transaccionRepository.findAlquilerByEstado(estado, fecha).stream()
                .map(TransaccionMapper.INSTANCE::toTransaccionDtoConJuegos)
                .collect(Collectors.toList());
    }

}
