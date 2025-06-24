package com.c4.atunesdelpacifico.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "productos")
public class Producto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Enumerated(EnumType.STRING)
    @Column(name = "nombre", nullable = false)
    private TipoProducto nombre;

    @Column(name = "descripcion")
    private String descripcion;

    @Column(name = "precio", nullable = false)
    private Double precio;

    public enum TipoProducto {
        Atun_en_aceite, Atun_en_agua, Atun_en_salsa
    }
}