package com.c4.atunesdelpacifico.controller;

import com.c4.atunesdelpacifico.dto.ClienteRequest;
import com.c4.atunesdelpacifico.model.Cliente;
import com.c4.atunesdelpacifico.model.Pedido;
import com.c4.atunesdelpacifico.service.ClienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/clientes")
public class ClienteController {

    @Autowired
    private ClienteService clienteService;

    @PostMapping
    public ResponseEntity<Cliente> registrarCliente(@RequestBody ClienteRequest clienteRequest) {
        Cliente cliente = new Cliente();
        cliente.setNombre(clienteRequest.getUsername());
        cliente.setIdentificacion(clienteRequest.getIdentificacion());
        cliente.setCorreo(clienteRequest.getCorreo());
        cliente.setTelefono(clienteRequest.getTelefono());
        cliente.setDireccion(clienteRequest.getDireccion());
        cliente.setEstado(Cliente.EstadoCliente.Activo);
        try {
            return ResponseEntity.ok(clienteService.registrarCliente(cliente, clienteRequest.getUsername(), clienteRequest.getPassword()));
        } catch (Exception e) {
            System.out.println("Error al registrar cliente: " + e.getMessage());
            return ResponseEntity.badRequest().body(null);
        }
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
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("Intentando eliminar cliente ID: " + id + ", Usuario: " + (auth != null ? auth.getName() : "null") + ", Rol: " + (auth != null ? auth.getAuthorities() : "null"));
        if (auth != null && auth.getAuthorities().stream().anyMatch(r -> r.getAuthority().equals("ROLE_Administrador"))) {
            try {
                clienteService.eliminarCliente(id);
                System.out.println("Cliente ID: " + id + " eliminado exitosamente");
                return ResponseEntity.noContent().build();
            } catch (Exception e) {
                System.out.println("Error al eliminar cliente ID: " + id + ": " + e.getMessage());
                return ResponseEntity.status(500).build(); // Error interno
            }
        } else {
            System.out.println("Acceso denegado para eliminar cliente ID: " + id);
            return ResponseEntity.status(403).build();
        }
    }
}