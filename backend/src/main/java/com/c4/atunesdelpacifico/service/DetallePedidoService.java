package com.c4.atunesdelpacifico.service;

import com.c4.atunesdelpacifico.model.DetallePedido;
import com.c4.atunesdelpacifico.repository.DetallePedidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DetallePedidoService {

    @Autowired
    private DetallePedidoRepository detallePedidoRepository;

    public List<DetallePedido> consultarDetallesPorPedido(Integer pedidoId) {
        return detallePedidoRepository.findByPedido_Id(pedidoId);
    }
}