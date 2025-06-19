package com.c4.atunesdelpacifico.controller;

import com.c4.atunesdelpacifico.model.Cliente;
import com.c4.atunesdelpacifico.model.Pedido;
import com.c4.atunesdelpacifico.service.ClienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/clientes")
public class ClienteController {

    @Autowired
    private ClienteService clienteService;

    @PostMapping
    public ResponseEntity<Cliente> registrarCliente(@RequestBody Cliente cliente) {
        return ResponseEntity.ok(clienteService.registrarCliente(cliente));
    }

    @GetMapping
    public ResponseEntity<List<Cliente>> consultarClientes(@RequestParam(required = false) String estado) {
        return ResponseEntity.ok(clienteService.consultarClientes(estado));
    }

    @GetMapping("/{id}/historial")
    public ResponseEntity<List<Pedido>> consultarHistorialPedidos(@PathVariable Integer id) {
        return ResponseEntity.ok(clienteService.consultarHistorialPedidos(id));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarCliente(@PathVariable Integer id) {
        clienteService.eliminarCliente(id);
        return ResponseEntity.noContent().build();
    }
}