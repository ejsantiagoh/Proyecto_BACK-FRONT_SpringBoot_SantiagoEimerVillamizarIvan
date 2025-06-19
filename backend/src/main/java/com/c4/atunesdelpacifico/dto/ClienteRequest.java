package com.c4.atunesdelpacifico.dto;

import lombok.Data;

@Data
public class ClienteRequest {
    private String nombre;
    private String identificacion;
    private String correo;
    private String telefono;
    private String direccion;
    private String username;
    private String password;
}
