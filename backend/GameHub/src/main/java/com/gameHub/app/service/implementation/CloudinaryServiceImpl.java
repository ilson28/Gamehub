package com.gameHub.app.service.implementation;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.util.Map;
import java.util.Objects;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.gameHub.app.service.interfaces.CloudinaryService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class CloudinaryServiceImpl implements CloudinaryService {

    private final Cloudinary cloudinary;

    @Override
    public Map<String, String> uploadImage(MultipartFile file) throws IOException {
        File convertedFile = convert(file);

        Map<String, String> uploadResult = cloudinary.uploader().upload(convertedFile, Map.of("folder", "gamehub"));

        Files.deleteIfExists(convertedFile.toPath());

        String url = uploadResult.get("secure_url");
        String publicId = uploadResult.get("public_id");
        return Map.of("url", url, "publicId", publicId);

    }

    @Override
    public Map<String, String> uploadImage(File file) throws IOException {

        Map<String, String> uploadResult = cloudinary.uploader().upload(file, Map.of("folder", "gamehub"));

        Files.deleteIfExists(file.toPath());

        String url = uploadResult.get("secure_url");
        String publicId = uploadResult.get("public_id");
        return Map.of("url", url, "publicId", publicId);
    }

    @Override
    public Map<String, String> delete(String publicId) throws IOException {
        Map<String, String> deleteResult = cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());

        return deleteResult;

    }

    private File convert(MultipartFile MultipartFile) throws IOException {

        File file = new File(Objects.requireNonNull(MultipartFile.getOriginalFilename()));

        try (FileOutputStream outputStream = new FileOutputStream(file)) {
            outputStream.write(MultipartFile.getBytes());

        }
        return file;

    }
}
