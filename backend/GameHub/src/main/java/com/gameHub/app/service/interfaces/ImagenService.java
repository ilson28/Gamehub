package com.gameHub.app.service.interfaces;

import java.io.IOException;

import org.springframework.web.multipart.MultipartFile;

import com.gameHub.app.persistence.entity.Imagen;

public interface ImagenService {

    Imagen uploadImage(MultipartFile file) throws IOException;

    void delete(Imagen img) throws IOException;
}
