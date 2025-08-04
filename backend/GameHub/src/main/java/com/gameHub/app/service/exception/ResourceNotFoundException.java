package com.gameHub.app.service.exception;

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }

    public ResourceNotFoundException(String resourceName, String fildName, Object value) {
        super(String.format("%s con %s='%s' no encontrado", resourceName, fildName, value));

    }
}
