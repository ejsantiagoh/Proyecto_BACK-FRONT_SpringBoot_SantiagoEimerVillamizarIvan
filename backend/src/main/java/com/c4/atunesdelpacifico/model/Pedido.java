package com.c4.atunesdelpacifico.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Data
@Table(name = "pedidos")
public class Pedido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    @Column(name = "fecha_pedido", nullable = false)
    private java.sql.Date fechaPedido;

    @Column(name = "fecha_entrega", nullable = false)
    private java.sql.Date fechaEntrega;

    @Column(name = "total", nullable = false)
    private Double total;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado", columnDefinition = "ENUM('Pendiente', 'En Proceso', 'Enviado', 'Cancelado')", nullable = false)
    private EstadoPedido estado;

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DetallePedido> detallePedidos;

    public enum EstadoPedido {
        Pendiente, En_Proceso, Enviado, Cancelado
    }
}