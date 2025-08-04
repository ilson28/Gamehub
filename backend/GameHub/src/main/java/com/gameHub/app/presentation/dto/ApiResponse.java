package com.gameHub.app.presentation.dto;

import java.time.LocalDateTime;
import lombok.Data;

@Data
public class ApiResponse<T> {

    private String message;
    private boolean success;
    private LocalDateTime timestamp;
    private T data;

    public ApiResponse(String message,  T data) {
        this.message = message;
        this.data = data;
        this.success = true;
        this.timestamp = LocalDateTime.now();
    }

    public ApiResponse(String message) {
        this.message = message;
        this.success = false;
        this.timestamp = LocalDateTime.now();
    }
}
