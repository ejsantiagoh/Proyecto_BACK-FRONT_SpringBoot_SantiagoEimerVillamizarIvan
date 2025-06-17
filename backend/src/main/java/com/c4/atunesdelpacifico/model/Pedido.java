package com.c4.atunesdelpacifico.model;

import jakarta.persistence.*;
import lombok.Data;

// import static org.mockito.Answers.values;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

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
    @Column(name = "estado", columnDefinition = "ENUM('Pendiente', 'En_Proceso', 'Enviado', 'Cancelado')", nullable = false)
    private EstadoPedido estado;

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DetallePedido> detallePedidos;

    // public enum EstadoPedido {
    //     Pendiente, En_Proceso, Enviado, Cancelado
    // }
    public enum EstadoPedido {
        Pendiente("Pendiente"),
        En_Proceso("En Proceso"),
        Enviado("Enviado"),
        Cancelado("Cancelado");

        private final String valor;

        EstadoPedido(String valor) {
            this.valor = valor;
        }

        @JsonValue
        public String getValor() {
            return valor;
        }

        @JsonCreator
        public static EstadoPedido fromValor(String valor) {
            for (EstadoPedido estado : values()) {
                if (estado.valor.equalsIgnoreCase(valor)) {
                    return estado;
                }
            }
            throw new IllegalArgumentException("EstadoPedido desconocido: " + valor);
        }
    }

}