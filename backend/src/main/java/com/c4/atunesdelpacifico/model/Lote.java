package com.c4.atunesdelpacifico.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "lotes")
public class Lote {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "codigo_lote", nullable = false, unique = true)
    private String codigoLote;

    @Column(name = "fecha_produccion", nullable = false)
    private java.sql.Date fechaProduccion;

    @ManyToOne
    @JoinColumn(name = "producto_id", nullable = false)
    private Producto producto;

    @Column(name = "cantidad", nullable = false)
    private Integer cantidad;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado", columnDefinition = "ENUM('Disponible', 'Vendido', 'Defectuoso')", nullable = false)
    private EstadoLote estado;

    public enum EstadoLote {
        Disponible, Vendido, Defectuoso
    }
}
