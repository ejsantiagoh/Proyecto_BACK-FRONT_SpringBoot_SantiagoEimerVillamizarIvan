package com.c4.atunesdelpacifico.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.c4.atunesdelpacifico.model.Pedido;

public interface PedidoRepository extends JpaRepository <Pedido, Integer>{
    List<Pedido> findByCliente_Id(Integer clienteId);
    List<Pedido> findByEstado(Pedido.EstadoPedido estado);
    List<Pedido> findByCliente_IdAndEstado(Integer clienteId, Pedido.EstadoPedido estado);
}
