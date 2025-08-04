package com.gameHub.app.service.interfaces;

import java.util.List;
import java.util.Optional;

import org.springframework.web.multipart.MultipartFile;

import com.gameHub.app.presentation.dto.VideoJuegoDto;

public interface VideoJuegoService {

    List<VideoJuegoDto> findAll();

    Optional<VideoJuegoDto> findById(Integer id);

    Optional<VideoJuegoDto> save(VideoJuegoDto videoJuego, MultipartFile imagen);

    void delete(Integer id);

    Long totalVideojuegos();
}
