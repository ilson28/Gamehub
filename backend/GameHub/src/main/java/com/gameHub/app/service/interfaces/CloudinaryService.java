package com.gameHub.app.service.interfaces;

import java.io.File;
import java.io.IOException;
import java.util.Map;

import org.springframework.web.multipart.MultipartFile;

public interface CloudinaryService {

    Map<String, String> uploadImage(MultipartFile file) throws IOException;

    Map<String, String> uploadImage(File file) throws IOException;

    Map<String, String> delete(String publicId) throws IOException;

}
