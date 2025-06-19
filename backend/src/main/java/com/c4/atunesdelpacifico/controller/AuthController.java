package com.c4.atunesdelpacifico.controller;

import com.c4.atunesdelpacifico.config.JwtUtil;
import com.c4.atunesdelpacifico.dto.AuthRequest;
import com.c4.atunesdelpacifico.dto.AuthResponse;
import com.c4.atunesdelpacifico.dto.UsuarioRequest;
import com.c4.atunesdelpacifico.model.Cliente;
import com.c4.atunesdelpacifico.model.Rol;
import com.c4.atunesdelpacifico.model.Usuario;
import com.c4.atunesdelpacifico.repository.RolRepository;
import com.c4.atunesdelpacifico.service.ClienteService;
import com.c4.atunesdelpacifico.service.CustomUserDetailsService;
import com.c4.atunesdelpacifico.service.UsuarioService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private ClienteService clienteService;

    @Autowired
    private RolRepository rolRepository;

    @PostMapping("/login")
    public ResponseEntity<?> createAuthenticationToken(@RequestBody AuthRequest authRequest) throws Exception {
        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword())
            );
        } catch (Exception e) {
            throw new Exception("Credenciales inválidas", e);
        }
        final UserDetails userDetails = userDetailsService.loadUserByUsername(authRequest.getUsername());
        final String token = jwtUtil.generateToken(userDetails);
        return ResponseEntity.ok(new AuthResponse(token));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerClient(@RequestBody UsuarioRequest usuarioRequest) {
        // Validar campos obligatorios
        if (usuarioRequest.getIdentificacion() == null || usuarioRequest.getIdentificacion().isEmpty()) {
            return ResponseEntity.badRequest().body("La identificación es obligatoria");
        }
        if (usuarioRequest.getTelefono() == null || usuarioRequest.getTelefono().isEmpty()) {
            return ResponseEntity.badRequest().body("El teléfono es obligatorio");
        }
        if (usuarioRequest.getDireccion() == null || usuarioRequest.getDireccion().isEmpty()) {
            return ResponseEntity.badRequest().body("La dirección es obligatoria");
        }

        // Validar que el rol sea Cliente (ID 3)
        if (usuarioRequest.getRolId() == null || !usuarioRequest.getRolId().equals(3)) {
            return ResponseEntity.badRequest().body("Solo se permite registrar usuarios con rol Cliente (ID 3)");
        }

        try {
            if (userDetailsService.loadUserByUsername(usuarioRequest.getUsername()) != null) {
                return ResponseEntity.badRequest().body("El usuario ya existe");
            }
        } catch (Exception e) {
            // Ignorar si no encuentra el usuario, ya que es lo esperado
        }

        Usuario usuario = new Usuario();
        usuario.setUsername(usuarioRequest.getUsername());
        usuario.setPassword(usuarioRequest.getPassword());
        usuario.setCorreo(usuarioRequest.getCorreo());
        Rol rol = rolRepository.findById(usuarioRequest.getRolId())
                .orElseThrow(() -> new RuntimeException("Rol no encontrado"));
        usuario.setRol(rol);

        // Registrar usuario
        usuario = usuarioService.registrarUsuario(usuario);

        // Crear registro en la tabla clientes para rol Cliente
        if (rol.getId() == 3) {
            Cliente cliente = new Cliente();
            cliente.setNombre(usuarioRequest.getUsername());
            cliente.setIdentificacion(usuarioRequest.getIdentificacion());
            cliente.setCorreo(usuario.getCorreo());
            cliente.setTelefono(usuarioRequest.getTelefono());
            cliente.setDireccion(usuarioRequest.getDireccion());
            cliente.setEstado(Cliente.EstadoCliente.Activo);
            cliente.setUsuario(usuario);
            clienteService.registrarCliente(cliente, usuario.getUsername(), usuario.getPassword());
        }

        return ResponseEntity.ok("Registro exitoso. Por favor, inicia sesión.");
    }

    @PostMapping("/admin/usuarios")
    public ResponseEntity<Usuario> registrarUsuario(@RequestBody UsuarioRequest usuarioRequest) {
        Usuario usuario = new Usuario();
        usuario.setUsername(usuarioRequest.getUsername());
        usuario.setPassword(usuarioRequest.getPassword());
        usuario.setCorreo(usuarioRequest.getCorreo());
        Rol rol = rolRepository.findById(usuarioRequest.getRolId())
                .orElseThrow(() -> new RuntimeException("Rol no encontrado"));
        usuario.setRol(rol);

        // Registrar usuario
        usuario = usuarioService.registrarUsuario(usuario);

        // Si el rol es Cliente, crear un registro en la tabla clientes (opcional para admin)
        if (rol.getId() == 3 && usuarioRequest.getIdentificacion() != null) {
            Cliente cliente = new Cliente();
            cliente.setNombre(usuarioRequest.getUsername());
            cliente.setIdentificacion(usuarioRequest.getIdentificacion());
            cliente.setCorreo(usuario.getCorreo());
            cliente.setTelefono(usuarioRequest.getTelefono() != null ? usuarioRequest.getTelefono() : "");
            cliente.setDireccion(usuarioRequest.getDireccion() != null ? usuarioRequest.getDireccion() : "");
            cliente.setEstado(Cliente.EstadoCliente.Activo);
            cliente.setUsuario(usuario);
            clienteService.registrarCliente(cliente, usuario.getUsername(), usuario.getPassword());
        }

        return ResponseEntity.ok(usuario);
    }

    @DeleteMapping("/admin/usuarios/{id}")
    public ResponseEntity<Void> eliminarUsuario(@PathVariable Integer id) {
        usuarioService.eliminarUsuario(id);
        return ResponseEntity.noContent().build();
    }
}