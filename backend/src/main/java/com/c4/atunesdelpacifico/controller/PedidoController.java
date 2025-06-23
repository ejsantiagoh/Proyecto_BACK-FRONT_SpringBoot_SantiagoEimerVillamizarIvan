package com.c4.atunesdelpacifico.controller;

import com.c4.atunesdelpacifico.model.Pedido;
import com.c4.atunesdelpacifico.model.DetallePedido;
import com.c4.atunesdelpacifico.service.PedidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
public class PedidoController {

    @Autowired
    private PedidoService pedidoService;

    @PostMapping("/api/cliente/pedidos")
    public ResponseEntity<Pedido> crearPedido(@RequestBody Pedido pedido) {
        try {
            return ResponseEntity.ok(pedidoService.crearPedido(pedido));
        } catch (RuntimeException e) {
            throw new ResponseStatusException(
                org.springframework.http.HttpStatus.BAD_REQUEST,
                e.getMessage(),
                e
            );
        }
    }

    @GetMapping("/api/cliente/pedidos")
    public ResponseEntity<List<Pedido>> consultarPedidos(@RequestParam(required = false) Integer clienteId,
                                                        @RequestParam(required = false) String estado) {
        return ResponseEntity.ok(pedidoService.consultarPedidos(clienteId, estado));
    }

    @PatchMapping("/api/operador/pedidos/{id}")
    public ResponseEntity<Pedido> actualizarEstado(@PathVariable Integer id, @RequestParam String estado) {
        return ResponseEntity.ok(pedidoService.actualizarEstado(id, estado));
    }

    @GetMapping("/api/cliente/{id}/detalles")
    public ResponseEntity<List<DetallePedido>> consultarDetallesPorPedido(@PathVariable Integer id) {
        return ResponseEntity.ok(pedidoService.consultarDetallesPorPedido(id));
    }

    @DeleteMapping("/api/operador/pedidos/{id}")
    public ResponseEntity<Void> eliminarPedido(@PathVariable Integer id) {
        pedidoService.eliminarPedido(id);
        return ResponseEntity.noContent().build();
    }
}