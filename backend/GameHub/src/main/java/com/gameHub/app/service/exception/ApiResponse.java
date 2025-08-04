package com.gameHub.app.service.exception;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Data
@NoArgsConstructor
public class ApiResponse {

    private String menssage;
    private String uri;
    private String fecha;

    public ApiResponse(String uri, String menssage) {
        this.uri = uri.replace("uri=", "");
        this.menssage = menssage;
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MMM/yyyy HH:mm");
        this.fecha = LocalDateTime.now().format(formatter);
    }
}
