package com.c4.atunesdelpacifico.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.c4.atunesdelpacifico.model.DetallePedido;

public interface DetallePedidoRepository extends JpaRepository<DetallePedido, Integer>{
    List<DetallePedido> findByPedido_Id(Integer pedidoId);
    List<DetallePedido> findByLote_Id(Integer loteId);
}
