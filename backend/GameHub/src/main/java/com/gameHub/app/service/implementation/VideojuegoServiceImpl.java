package com.gameHub.app.service.implementation;

import com.gameHub.app.persistence.entity.VideoJuego;
import com.gameHub.app.persistence.repository.VideoJuegoRepository;
import com.gameHub.app.presentation.dto.VideoJuegoDto;
import com.gameHub.app.service.exception.ResourceNotFoundException;
import com.gameHub.app.service.interfaces.VideoJuegoService;
import com.gameHub.app.util.ImagesUtil;
import com.gameHub.app.util.mapper.VideoJuegoMapper;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class VideojuegoServiceImpl implements VideoJuegoService {

    private final VideoJuegoRepository videoJuegoRepository;

    private final VideoJuegoMapper videoJuegoMapper;

    @Transactional(readOnly = true)
    @Override
    public List<VideoJuegoDto> findAll() {

        return videoJuegoRepository.findAll().stream()
                .map(videoJuegoMapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    @Override
    public Optional<VideoJuegoDto> findById(Integer id) {

        VideoJuego juego = videoJuegoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Videjuego not found with id " + id));
        VideoJuegoDto videoJuegoDto = this.videoJuegoMapper.toDto(juego);

        return Optional.ofNullable(videoJuegoDto);
    }

    @Transactional
    @Override
    public Optional<VideoJuegoDto> save(VideoJuegoDto videoJuego, MultipartFile imagen) {

        String fileName = null;

        if (imagen != null && !imagen.isEmpty()) {

            // 1. Guardar imagen en disco
            fileName = ImagesUtil.storeFile(imagen);
        }

        // 2. Mapear el DTO a la entidad
        VideoJuego juego = videoJuegoMapper.toEntity(videoJuego);

        // 3. Asignar el nombre del archivo de imagen
        juego.setImagen(fileName);
        juego.setActivo(1); // Asignar activo por defecto

        // 4. Guardar el videojuego en la base de datos
        VideoJuego guardado = videoJuegoRepository.save(juego);

        // 5. Mapear de vuelta a DTO
        VideoJuegoDto resultado = videoJuegoMapper.toDto(guardado);

        return Optional.ofNullable(resultado);
    }

    @Transactional
    @Override
    public void delete(Integer id) {

        this.findById(id).ifPresent(juego -> {

            VideoJuego videoJuego = this.videoJuegoMapper.toEntity(juego);
            videoJuego.setActivo(0);
            videoJuegoRepository.save(videoJuego);

        });

    }

    @Transactional(readOnly = true)
    @Override
    public Long totalVideojuegos() {
        // Llamar al repositorio para obtener el total de videojuegos activos
        return this.videoJuegoRepository.totalVideojuegos();
    }

    @Override
    public Long TotalStock() {

        return this.videoJuegoRepository.TotalStock();
    }
}
