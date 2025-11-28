package com.gameHub.app.service.implementation;

import com.gameHub.app.persistence.entity.RegistroDevolucion;
import com.gameHub.app.persistence.repository.RegistroDevolucionRepository;
import com.gameHub.app.persistence.repository.TransaccionRepository;
import com.gameHub.app.presentation.dto.RegistroDevolucionDto;
import com.gameHub.app.presentation.dto.TransaccionResponseDto;
import com.gameHub.app.service.exception.ResourceNotFoundException;
import com.gameHub.app.service.interfaces.RegistroDevolucionService;
import com.gameHub.app.util.mapper.TransaccionMapper;

import lombok.RequiredArgsConstructor;

import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Pageable;

import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RegistroDevolucionServiceImpl implements RegistroDevolucionService {

    private final RegistroDevolucionRepository registroDevolucionRepository;
    private final TransaccionRepository transaccionRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<RegistroDevolucionDto> findAll(String cedula, LocalDate fromDate, LocalDate toDate,
            Pageable pageable) {
        ModelMapper mapper = new ModelMapper();
        return registroDevolucionRepository.findAllWithFilters(cedula, fromDate, toDate, pageable)
                .map(r -> mapper.map(r, RegistroDevolucionDto.class));
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<RegistroDevolucionDto> findById(Integer id) {
        ModelMapper mapper = new ModelMapper();
        RegistroDevolucionDto registroDevolucionDto = mapper.map(registroDevolucionRepository
                .findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Registro devolucion", "Id", id)),
                RegistroDevolucionDto.class);

        return Optional.ofNullable(registroDevolucionDto);
    }

    @Transactional
    @Override
    public RegistroDevolucionDto save(RegistroDevolucionDto devolucion) {
        ModelMapper mapper = new ModelMapper();

        TransaccionResponseDto transaccion = TransaccionMapper.INSTANCE
                .toTransaccionDtoConJuegos(this.transaccionRepository
                        .findById(devolucion.getIdTransaccion())
                        .orElseThrow(() -> new ResourceNotFoundException("Transaccion", "Id",
                                devolucion.getTransaccion().getId())));

        devolucion.setTransaccion(transaccion);

        this.transaccionRepository.updateEstadoToDevuelto(devolucion.getTransaccion().getId());

        RegistroDevolucion devolucion1 = mapper.map(devolucion, RegistroDevolucion.class);

        return mapper.map(registroDevolucionRepository.save(devolucion1), RegistroDevolucionDto.class);
    }

    @Override
    public void delete(Integer id) {

    }

}
