package com.gameHub.app.presentation.controller;

import com.gameHub.app.presentation.dto.VideoJuegoDto;
import com.gameHub.app.service.interfaces.VideoJuegoService;

import com.gameHub.app.presentation.dto.ApiResponse;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api/videojuegos")
public class VidejuegoController {

    private VideoJuegoService videoJuegoService;

    public VidejuegoController(VideoJuegoService videoJuegoService) {
        this.videoJuegoService = videoJuegoService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<?>> getAll() {

        ApiResponse<List<VideoJuegoDto>> response = new ApiResponse<>(
                "Data retrieved successfully",
                videoJuegoService.findAll());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> getById(@PathVariable Integer id) {

        VideoJuegoDto videoJuego = videoJuegoService.findById(id).orElseThrow();
        ApiResponse<VideoJuegoDto> response = new ApiResponse<>(
                "Data retrieved successfully",
                videoJuego);

        return ResponseEntity.ok(response);

    }

    @GetMapping("/total-videojuegos")
    public ResponseEntity<ApiResponse<Long>> totalVideojuegos() {
        Long total = videoJuegoService.totalVideojuegos();
        ApiResponse<Long> response = new ApiResponse<>(
                "Total videojuegos retrieved successfully",
                total);

        return ResponseEntity.ok(response);

    }

    @PostMapping
    public ResponseEntity<ApiResponse<?>> create(
            @RequestPart("videoJuegoDto") @Valid VideoJuegoDto videoJuegoDto,
            @RequestPart("imagen") MultipartFile imagen) {

        VideoJuegoDto createdVideoJuego = videoJuegoService.save(videoJuegoDto, imagen)
                .orElseThrow();

        ApiResponse<VideoJuegoDto> response = new ApiResponse<>(
                "Video game created successfully",
                createdVideoJuego);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<?>> update(@PathVariable Integer id,
            @RequestPart @Valid VideoJuegoDto videoJuegoDto,
            @RequestPart(required = false) MultipartFile imagen) {

        VideoJuegoDto videoJuego = videoJuegoService.findById(id).orElseThrow();

        videoJuegoDto.setId(videoJuego.getId());

        ApiResponse<VideoJuegoDto> response = new ApiResponse<>(
                "Video game updated successfully",
                videoJuegoService.save(videoJuegoDto, imagen).orElseThrow());

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {

        videoJuegoService.delete(id);

        return ResponseEntity.noContent().build();

    }

}
