package com.c4.atunesdelpacifico.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "clientes")
public class Cliente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "nombre", nullable = false)
    private String nombre;

    @Column(name = "identificacion", nullable = false, unique = true)
    private String identificacion;

    @Column(name = "correo", nullable = false)
    private String correo;

    @Column(name = "telefono")
    private String telefono;

    @Column(name = "direccion")
    private String direccion;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado", columnDefinition = "ENUM('Activo', 'Inactivo')", nullable = false)
    private EstadoCliente estado;

    public enum EstadoCliente {
        Activo, Inactivo
    }
}
