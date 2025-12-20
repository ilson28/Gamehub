package com.gameHub.app.presentation.advice;

import org.apache.commons.lang3.ObjectUtils.Null;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import com.gameHub.app.presentation.dto.ApiResponse;
import com.gameHub.app.service.exception.ResourceNotFoundException;

import java.nio.file.AccessDeniedException;
import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<?>> resourceNotFoundException(ResourceNotFoundException e) {

        ApiResponse<Null> response = new ApiResponse<>("Recurso no encontrado");

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<?>> MethodArgumentNotValidException(MethodArgumentNotValidException e) {
        Map<String, String> errors = new HashMap<>();

        // Recorrer los errores de validación y agregarlos al mapa
        e.getBindingResult().getFieldErrors().forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));

        ApiResponse<Map<String, String>> response = new ApiResponse<>(
                "Errores de validación",
                errors);

        response.setSuccess(false);

        return ResponseEntity.badRequest().body(response);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse<?>> accessDeniedException(AccessDeniedException e) {

        ApiResponse<Null> response = new ApiResponse<>("Acceso denegado: " + e.getMessage());
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);

    }

    @ExceptionHandler(DataAccessException.class)
    public ResponseEntity<ApiResponse<?>> dataAccessException(DataAccessException e) {

        ApiResponse<Null> response = new ApiResponse<>("Error de acceso a datos: " + e.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);

    }

    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<ApiResponse<?>> dataAccessException(NoResourceFoundException e) {

        ApiResponse<Null> response = new ApiResponse<>(e.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);

    }

    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<ApiResponse<?>> usernameNotFoundException(UsernameNotFoundException e) {

        ApiResponse<Null> response = new ApiResponse<>("Usuario no encontrado: " + e.getMessage());

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ApiResponse<?>> authenticationException(AuthenticationException e) {

        ApiResponse<Null> response = new ApiResponse<>("Credenciales inválidas");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<?>> globalExceptionHandler(Exception e) {

        ApiResponse<Null> response = new ApiResponse<>("Error interno del servidor: " + e.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }

}
