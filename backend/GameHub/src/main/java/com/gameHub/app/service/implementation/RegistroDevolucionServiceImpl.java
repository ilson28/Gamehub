package com.gameHub.app.service.implementation;

import com.gameHub.app.persistence.entity.RegistroDevolucion;
import com.gameHub.app.persistence.repository.RegistroDevolucionRepository;
import com.gameHub.app.presentation.dto.RegistroDevolucionDto;
import com.gameHub.app.service.exception.ResourceNotFoundException;
import com.gameHub.app.service.interfaces.RegistroDevolucionService;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RegistroDevolucionServiceImpl implements RegistroDevolucionService {

    private RegistroDevolucionRepository registroDevolucionRepository;

    public RegistroDevolucionServiceImpl(RegistroDevolucionRepository registroDevolucionRepository) {
        this.registroDevolucionRepository = registroDevolucionRepository;
    }

    @Transactional(readOnly = true)
    @Override
    public List<RegistroDevolucionDto> findAll() {
        ModelMapper mapper = new ModelMapper();
        return registroDevolucionRepository.findAll().stream()
                .map(r -> mapper.map(r, RegistroDevolucionDto.class))
                .collect(Collectors.toList());
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

        RegistroDevolucion devolucion1 = mapper.map(devolucion, RegistroDevolucion.class);

        return mapper.map(registroDevolucionRepository.save(devolucion1), RegistroDevolucionDto.class);
    }

    @Override
    public void delete(Integer id) {

    }
}
