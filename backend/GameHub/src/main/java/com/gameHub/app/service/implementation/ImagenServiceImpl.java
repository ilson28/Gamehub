package com.gameHub.app.service.implementation;

import java.io.IOException;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.gameHub.app.persistence.entity.Imagen;
import com.gameHub.app.persistence.repository.ImagenRepository;
import com.gameHub.app.service.interfaces.ImagenService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class ImagenServiceImpl implements ImagenService {

    private final CloudinaryServiceImpl cloudinaryService;
    private final ImagenRepository imagenRepository;

    @Override
    public Imagen uploadImage(MultipartFile file) throws IOException {
        Map<String, String> result = this.cloudinaryService.uploadImage(file);
        String url = result.get("url");
        String publicId = result.get("publicId");
        Imagen img = new Imagen(file.getOriginalFilename(), url, publicId);

        return this.imagenRepository.save(img);
    }

    @Override
    public void delete(Imagen img) throws IOException {

        this.cloudinaryService.delete(img.getImagenId());
        this.imagenRepository.delete(img);
    }

}
