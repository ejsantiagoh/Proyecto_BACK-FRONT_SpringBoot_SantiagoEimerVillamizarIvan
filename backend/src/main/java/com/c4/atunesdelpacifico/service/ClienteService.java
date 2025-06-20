package com.c4.atunesdelpacifico.service;

import com.c4.atunesdelpacifico.model.Cliente;
import com.c4.atunesdelpacifico.model.Pedido;
import com.c4.atunesdelpacifico.model.Rol;
import com.c4.atunesdelpacifico.model.Usuario;
import com.c4.atunesdelpacifico.repository.ClienteRepository;
import com.c4.atunesdelpacifico.repository.PedidoRepository;
import com.c4.atunesdelpacifico.repository.RolRepository;
import com.c4.atunesdelpacifico.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClienteService {

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private RolRepository rolRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Cliente registrarCliente(Cliente cliente, String username, String password) {
        if (cliente.getNombre() == null || cliente.getNombre().isEmpty()) {
            throw new IllegalArgumentException("El nombre del cliente es obligatorio");
        }
        if (cliente.getIdentificacion() == null || cliente.getIdentificacion().isEmpty()) {
            throw new IllegalArgumentException("La identificación es obligatoria");
        }
        if (cliente.getTelefono() == null || cliente.getTelefono().isEmpty()) {
            throw new IllegalArgumentException("El teléfono es obligatorio");
        }
        if (cliente.getDireccion() == null || cliente.getDireccion().isEmpty()) {
            throw new IllegalArgumentException("La dirección es obligatoria");
        }
        if (clienteRepository.findByIdentificacion(cliente.getIdentificacion()).isPresent()) {
            throw new IllegalArgumentException("La identificación ya está registrada");
        }
        if (username == null || username.isEmpty() || password == null || password.isEmpty()) {
            throw new IllegalArgumentException("El nombre de usuario y la contraseña son obligatorios");
        }

        Usuario usuario = cliente.getUsuario();
        if (usuario == null) {
            usuario = new Usuario();
            usuario.setUsername(username);
            usuario.setPassword(password);
            usuario.setCorreo(cliente.getCorreo());
            Rol rolCliente = rolRepository.findById(3)
                    .orElseThrow(() -> new RuntimeException("Rol Cliente no encontrado"));
            usuario.setRol(rolCliente);
            usuario = usuarioService.registrarUsuario(usuario);
            cliente.setUsuario(usuario);
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

    public void eliminarCliente(Integer id) {
        System.out.println("Intentando eliminar cliente ID: " + id);
        Optional<Cliente> clienteOpt = clienteRepository.findById(id);
        if (clienteOpt.isEmpty()) {
            System.out.println("Cliente ID: " + id + " no encontrado");
            throw new IllegalArgumentException("Cliente no encontrado");
        }
        Cliente cliente = clienteOpt.get();
        List<Pedido> pedidosActivos = pedidoRepository.findByCliente_IdAndEstado(id, Pedido.EstadoPedido.Pendiente);
        pedidosActivos.addAll(pedidoRepository.findByCliente_IdAndEstado(id, Pedido.EstadoPedido.En_Proceso));
        if (!pedidosActivos.isEmpty()) {
            System.out.println("Cliente ID: " + id + " tiene pedidos activos: " + pedidosActivos.size());
            throw new IllegalStateException("No se puede eliminar un cliente con pedidos activos");
        }
        Integer usuarioId = cliente.getUsuario().getId();
        System.out.println("Eliminando cliente ID: " + id + " primero");
        clienteRepository.delete(cliente); // Eliminar el Cliente primero
        System.out.println("Eliminando usuario asociado ID: " + usuarioId);
        usuarioService.eliminarUsuario(usuarioId); // Luego eliminar el Usuario
        System.out.println("Cliente ID: " + id + " eliminado exitosamente");
    }
}