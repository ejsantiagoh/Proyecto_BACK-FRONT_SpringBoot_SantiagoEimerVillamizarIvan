package com.c4.atunesdelpacifico.config;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler({ IllegalStateException.class, RuntimeException.class })
    public ResponseEntity<Map<String, String>> handleExcepciones(RuntimeException ex) {
        Map<String, String> error = new HashMap<>();
        String errorMessage = ex.getMessage();
        error.put("message", errorMessage != null ? errorMessage : "Error desconocido");
        System.out.println("Error capturado: " + errorMessage); // Registro en consola
        return ResponseEntity.badRequest().body(error);
    }
}