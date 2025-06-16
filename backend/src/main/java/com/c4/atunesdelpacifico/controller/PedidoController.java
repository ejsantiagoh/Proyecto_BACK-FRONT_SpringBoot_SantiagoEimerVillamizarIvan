package com.c4.atunesdelpacifico.controller;

import com.c4.atunesdelpacifico.model.Pedido;
import com.c4.atunesdelpacifico.model.DetallePedido;
import com.c4.atunesdelpacifico.service.PedidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {

    @Autowired
    private PedidoService pedidoService;

    @PostMapping
    public ResponseEntity<Pedido> crearPedido(@RequestBody Pedido pedido) {
        return ResponseEntity.ok(pedidoService.crearPedido(pedido));
    }

    @GetMapping
    public ResponseEntity<List<Pedido>> consultarPedidos() {
        return ResponseEntity.ok(pedidoService.consultarPedidos());
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<Pedido> actualizarEstado(@PathVariable Integer id, @RequestParam String estado) {
        return ResponseEntity.ok(pedidoService.actualizarEstado(id, estado));
    }

    @GetMapping("/{id}/detalles")
    public ResponseEntity<List<DetallePedido>> consultarDetallesPorPedido(@PathVariable Integer id) {
        return ResponseEntity.ok(pedidoService.consultarDetallesPorPedido(id));
    }
}