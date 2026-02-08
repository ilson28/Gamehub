package com.gameHub.app.service.implementation;

import com.gameHub.app.persistence.entity.Imagen;
import com.gameHub.app.persistence.entity.VideoJuego;
import com.gameHub.app.persistence.repository.VideoJuegoRepository;
import com.gameHub.app.presentation.dto.VideoJuegoDto;
import com.gameHub.app.service.exception.ResourceNotFoundException;
import com.gameHub.app.service.interfaces.ImagenService;
import com.gameHub.app.service.interfaces.VideoJuegoService;
import com.gameHub.app.util.mapper.VideoJuegoMapper;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class VideojuegoServiceImpl implements VideoJuegoService {

    private final VideoJuegoRepository videoJuegoRepository;
    private final VideoJuegoMapper videoJuegoMapper;

    private final ImagenService imagenService;

    @Transactional(readOnly = true)
    @Override
    public List<VideoJuegoDto> findAll(String titulo) {

        return videoJuegoRepository.findAllGames(titulo).stream()
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
    public Optional<VideoJuegoDto> save(VideoJuegoDto videoJuegoDto, MultipartFile MultipartFile) {

        if (MultipartFile == null || MultipartFile.isEmpty()) {

            throw new IllegalArgumentException("La imagen es obligatoria");

        }
        VideoJuego game = this.videoJuegoMapper.toEntity(videoJuegoDto);

        if (videoJuegoDto.getId() != null && videoJuegoDto.getId() != 0) {
            try {
                this.imagenService.delete(game.getImagen());
            } catch (IOException e) {
                throw new RuntimeException("Error al eliminar la imagen anterior: " + e.getMessage());
            }
        }

        Imagen img;
        try {
            img = this.imagenService.uploadImage(MultipartFile);
        } catch (IOException e) {
            throw new RuntimeException("Error al subir la imagen: " + e.getMessage());
        }

        game.setImagen(img);
        game.setActivo(1);

        VideoJuego savedGame = this.videoJuegoRepository.save(game);

        return Optional.ofNullable(this.videoJuegoMapper.toDto(savedGame));

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
