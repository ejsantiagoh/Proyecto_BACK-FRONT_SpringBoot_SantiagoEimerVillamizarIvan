package com.c4.atunesdelpacifico.service;

import com.c4.atunesdelpacifico.model.Cliente;
import com.c4.atunesdelpacifico.model.Pedido;
import com.c4.atunesdelpacifico.repository.ClienteRepository;
import com.c4.atunesdelpacifico.repository.PedidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClienteService {

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private PedidoRepository pedidoRepository;

    public Cliente registrarCliente(Cliente cliente) {
        if (cliente.getNombre() == null || cliente.getNombre().isEmpty()) {
            throw new IllegalArgumentException("El nombre del cliente es obligatorio");
        }
        if (clienteRepository.findByIdentificacion(cliente.getIdentificacion()).isPresent()) {
            throw new IllegalArgumentException("La identificación ya está registrada");
        }
        return clienteRepository.save(cliente);
    }

    public List<Cliente> consultarClientes(String estado) {
        if (estado != null && !estado.isEmpty()) {
            return clienteRepository.findByEstado(Cliente.EstadoCliente.valueOf(estado));
        }
        return clienteRepository.findAll();
    }

    public List<Pedido> consultarHistorialPedidos(Integer clienteId) {
        Optional<Cliente> cliente = clienteRepository.findById(clienteId);
        if (cliente.isEmpty()) {
            throw new IllegalArgumentException("Cliente no encontrado");
        }
        return pedidoRepository.findByCliente_Id(clienteId);
    }
}