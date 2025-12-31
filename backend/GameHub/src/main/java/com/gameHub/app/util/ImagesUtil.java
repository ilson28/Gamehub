package com.gameHub.app.util;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Objects;
import java.util.UUID;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.web.multipart.MultipartFile;

public class ImagesUtil {

    // Ruta donde se guardarán los archivos
    private static final Path fileStorageLocation = Paths.get("uploads").toAbsolutePath().normalize();

    /**
     * Guarda un archivo en disco.
     *
     * @param file archivo recibido desde el frontend
     * @return nombre del archivo guardado
     */
    public static String storeFile(MultipartFile file) {

        // Limpiar el nombre del archivo original
        // String fileName =
        // Paths.get(Objects.requireNonNull(file.getOriginalFilename())).getFileName().toString();
        String originalFileName = Objects.requireNonNull(file.getOriginalFilename());

        // extraer extensión
        String extension = "";
        int dotIndex = originalFileName.lastIndexOf(".");
        if (dotIndex != -1) {
            extension = originalFileName.substring(dotIndex);
        }

        // nombre único para el almacenamiento
        String fileName = UUID.randomUUID() + extension;

        try {
            // Crear la carpeta si no existe
            if (!Files.exists(fileStorageLocation)) {
                Files.createDirectories(fileStorageLocation);
            }

            // Ruta completa donde se guardará el archivo
            Path targetLocation = fileStorageLocation.resolve(fileName);

            // Copiar el contenido del archivo a la ubicación de destino
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            // Devolver el nombre del archivo para almacenarlo en BD o mostrarlo
            return fileName;

        } catch (IOException e) {
            throw new RuntimeException("No se pudo guardar el archivo: " + fileName, e);
        }
    }

    /**
     * Carga un archivo ya guardado como recurso
     * 
     * @param fileName nombre del archivo
     * @return recurso que representa el archivo (para enviar al frontend)
     */
    public static Resource loadFileAsResource(String fileName) {
        try {
            Path filePath = fileStorageLocation.resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new RuntimeException("Archivo no encontrado o no accesible: " + fileName);
            }

        } catch (MalformedURLException ex) {
            throw new RuntimeException("Error al cargar el archivo: " + fileName, ex);
        }
    }

}
