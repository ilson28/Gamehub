package com.gameHub.app.presentation.controller;

import java.io.IOException;
import java.nio.file.Files;

import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gameHub.app.util.ImagesUtil;

@RestController
@RequestMapping("/api/images")
public class FileImageController {

    @GetMapping("/{fileName:.+}")
    public ResponseEntity<Resource> obtenerImagen(@PathVariable String fileName) {
        Resource recurso = ImagesUtil.loadFileAsResource(fileName);

        String contentType = "application/octet-stream"; // Valor por defecto si no se puede detectar

        try {
            contentType = Files.probeContentType(recurso.getFile().toPath());
        } catch (IOException e) {
            // Puedes registrar un log si quieres, o dejar el tipo genérico
            System.out.println("No se pudo determinar el tipo de contenido para el archivo: " + fileName);
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + recurso.getFilename() + "\"")
                .body(recurso);
    }
}
