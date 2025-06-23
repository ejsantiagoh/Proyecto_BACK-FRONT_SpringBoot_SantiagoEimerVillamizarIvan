package com.c4.atunesdelpacifico.dto;

import lombok.Data;

@Data
public class UsuarioRequest {
    private String username;
    private String password;
    private String correo;
    private Integer rolId;
    private String identificacion;
    private String telefono;
    private String direccion;
    private String estado;
}
