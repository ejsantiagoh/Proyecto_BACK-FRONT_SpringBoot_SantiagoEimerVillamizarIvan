package com.c4.atunesdelpacifico.controller;

import com.c4.atunesdelpacifico.config.JwtUtil;
import com.c4.atunesdelpacifico.dto.AuthRequest;
import com.c4.atunesdelpacifico.dto.AuthResponse;
import com.c4.atunesdelpacifico.dto.UsuarioRequest;
import com.c4.atunesdelpacifico.model.Cliente;
import com.c4.atunesdelpacifico.model.Rol;
import com.c4.atunesdelpacifico.model.Usuario;
import com.c4.atunesdelpacifico.repository.ClienteRepository;
import com.c4.atunesdelpacifico.repository.RolRepository;
import com.c4.atunesdelpacifico.repository.UsuarioRepository;
import com.c4.atunesdelpacifico.service.ClienteService;
import com.c4.atunesdelpacifico.service.CustomUserDetailsService;
import com.c4.atunesdelpacifico.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @PostMapping("/login")
    public ResponseEntity<?> createAuthenticationToken(@RequestBody AuthRequest authRequest) throws Exception {
        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword())
            );
        } catch (Exception e) {
            System.out.println("Fallo en autenticación: " + e.getMessage());
            throw new Exception("Credenciales inválidas", e);
        }
        UserDetails userDetails = userDetailsService.loadUserByUsername(authRequest.getUsername());
        Usuario usuario = usuarioService.findByUsername(authRequest.getUsername());
        String token = jwtUtil.generateToken(userDetails, usuario);
        System.out.println("Token generado para: " + authRequest.getUsername() + ", Rol: " + userDetails.getAuthorities() + ", UserId: " + usuario.getId());
        return ResponseEntity.ok(new AuthResponse(token));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerClient(@RequestBody UsuarioRequest usuarioRequest) {
        if (usuarioRequest.getIdentificacion() == null || usuarioRequest.getIdentificacion().isEmpty()) {
            return ResponseEntity.badRequest().body("La identificación es obligatoria");
        }
        if (usuarioRequest.getTelefono() == null || usuarioRequest.getTelefono().isEmpty()) {
            return ResponseEntity.badRequest().body("El teléfono es obligatorio");
        }
        if (usuarioRequest.getDireccion() == null || usuarioRequest.getDireccion().isEmpty()) {
            return ResponseEntity.badRequest().body("La dirección es obligatoria");
        }

        if (usuarioRequest.getRolId() == null || !usuarioRequest.getRolId().equals(3)) {
            return ResponseEntity.badRequest().body("Solo se permite registrar usuarios con rol Cliente (ID 3)");
        }

        try {
            if (userDetailsService.loadUserByUsername(usuarioRequest.getUsername()) != null) {
                return ResponseEntity.badRequest().body("El usuario ya existe");
            }
        } catch (Exception e) {
            // Ignorar si no encuentra el usuario
        }

        Usuario usuario = new Usuario();
        usuario.setUsername(usuarioRequest.getUsername());
        usuario.setPassword(usuarioRequest.getPassword());
        usuario.setCorreo(usuarioRequest.getCorreo());
        Rol rol = rolRepository.findById(usuarioRequest.getRolId())
                .orElseThrow(() -> new RuntimeException("Rol no encontrado"));
        usuario.setRol(rol);

        usuario = usuarioService.registrarUsuario(usuario);

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

        usuario = usuarioService.registrarUsuario(usuario);

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

    @GetMapping("/admin/usuarios")
    public ResponseEntity<List<Usuario>> consultarUsuarios() {
        return ResponseEntity.ok(usuarioService.consultarTodosLosUsuarios());
    }

    @DeleteMapping("/admin/usuarios/{id}")
    public ResponseEntity<Void> eliminarUsuario(@PathVariable Integer id) {
        usuarioService.eliminarUsuario(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/admin/usuarios/{id}")
    public ResponseEntity<Usuario> actualizarUsuario(@PathVariable Integer id, @RequestBody UsuarioRequest usuarioRequest) {
        Usuario usuarioExistente = usuarioService.findById(id); // Buscar usuario por ID
        if (usuarioRequest.getUsername() != null) {
            if (!usuarioRequest.getUsername().equals(usuarioExistente.getUsername()) && usuarioRepository.findByUsername(usuarioRequest.getUsername()).isPresent()) {
                return ResponseEntity.badRequest().body(null); // Username ya existe
            }
            usuarioExistente.setUsername(usuarioRequest.getUsername());
        }
        if (usuarioRequest.getCorreo() != null) usuarioExistente.setCorreo(usuarioRequest.getCorreo());
        if (usuarioRequest.getPassword() != null && !usuarioRequest.getPassword().isEmpty()) {
            usuarioExistente.setPassword(usuarioRequest.getPassword());
        }
        if (usuarioRequest.getRolId() != null) {
            Rol rol = rolRepository.findById(usuarioRequest.getRolId())
                    .orElseThrow(() -> new RuntimeException("Rol no encontrado"));
            if (rol.getId() == 1 && usuarioExistente.getId() != 1) { // Evitar cambiar rol a Admin excepto para el admin original
                return ResponseEntity.badRequest().body(null);
            }
            if (usuarioRepository.countClientesByUsuarioId(id) > 0 && usuarioRequest.getRolId() != 3) {
                return ResponseEntity.badRequest().body(null); // No cambiar rol si hay cliente asociado
            }
            usuarioExistente.setRol(rol);
        }

        // Actualizar el Cliente asociado si el rol es Cliente (ID 3)
        if (usuarioExistente.getRol().getId() == 3) {
            Cliente cliente = clienteRepository.findByUsuario_Id(id)
                    .orElseThrow(() -> new RuntimeException("Cliente no encontrado para el usuario"));
            if (usuarioRequest.getUsername() != null) cliente.setNombre(usuarioRequest.getUsername());
            if (usuarioRequest.getCorreo() != null) cliente.setCorreo(usuarioRequest.getCorreo());
            if (usuarioRequest.getIdentificacion() != null) cliente.setIdentificacion(usuarioRequest.getIdentificacion());
            if (usuarioRequest.getTelefono() != null) cliente.setTelefono(usuarioRequest.getTelefono());
            if (usuarioRequest.getDireccion() != null) cliente.setDireccion(usuarioRequest.getDireccion());
            if (usuarioRequest.getEstado() != null) {
                try {
                    cliente.setEstado(Cliente.EstadoCliente.valueOf(usuarioRequest.getEstado()));
                } catch (IllegalArgumentException e) {
                    return ResponseEntity.badRequest().body(null); // Estado inválido
                }
            }
            try {
                clienteRepository.save(cliente);
            } catch (Exception e) {
                return ResponseEntity.badRequest().body(null); // Manejar errores de actualización del cliente
            }
        }

        try {
            usuarioExistente = usuarioService.registrarUsuario(usuarioExistente); // Guardar y encriptar password
            return ResponseEntity.ok(usuarioExistente);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(null);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(500).body(null);
        }
    }
}