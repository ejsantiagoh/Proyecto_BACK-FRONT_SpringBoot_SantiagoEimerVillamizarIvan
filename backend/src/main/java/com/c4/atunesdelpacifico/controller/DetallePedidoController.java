package com.c4.atunesdelpacifico.controller;

import com.c4.atunesdelpacifico.model.DetallePedido;
import com.c4.atunesdelpacifico.service.DetallePedidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/cliente/pedidos")
public class DetallePedidoController {

    @Autowired
    private DetallePedidoService detallePedidoService;

    @GetMapping("/{pedidoId}/detalles")
    public ResponseEntity<List<DetallePedido>> consultarDetallesPorPedido(@PathVariable Integer pedidoId) {
        return ResponseEntity.ok(detallePedidoService.consultarDetallesPorPedido(pedidoId));
    }
}
