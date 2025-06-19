package com.c4.atunesdelpacifico.controller;

import com.c4.atunesdelpacifico.config.JwtUtil;
import com.c4.atunesdelpacifico.dto.AuthRequest;
import com.c4.atunesdelpacifico.dto.AuthResponse;
import com.c4.atunesdelpacifico.model.Rol;
import com.c4.atunesdelpacifico.model.Usuario;
import com.c4.atunesdelpacifico.repository.RolRepository;
import com.c4.atunesdelpacifico.service.CustomUserDetailsService;
import com.c4.atunesdelpacifico.service.UsuarioService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
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
    private RolRepository rolRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

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
    public ResponseEntity<?> registerClient(@RequestBody AuthRequest authRequest) {
        // Validar que el username no exista
        try {
            if (userDetailsService.loadUserByUsername(authRequest.getUsername()) != null) {
                return ResponseEntity.badRequest().body("El usuario ya existe");
            }
        } catch (UsernameNotFoundException e) {
            // Ignorar si no encuentra el usuario, ya que es lo esperado
        }
        // Crear nuevo usuario como Cliente (rol_id = 3)
        Usuario usuario = new Usuario();
        usuario.setUsername(authRequest.getUsername());
        usuario.setPassword(passwordEncoder.encode(authRequest.getPassword()));
        usuario.setCorreo(authRequest.getUsername() + "@example.com"); // Correo temporal, ajustable

        // Cargar rol Cliente (id = 3) desde la base de datos
        Rol rolCliente = rolRepository.findById(3)
            .orElseThrow(() -> new RuntimeException("Rol Cliente no encontrado"));
        usuario.setRol(rolCliente);

        try {
            usuarioService.registrarUsuario(usuario);
            return ResponseEntity.ok("Registro exitoso. Por favor, inicia sesión.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al registrar: " + e.getMessage());
        }
    }

    @DeleteMapping("/admin/usuarios/{id}")
    public ResponseEntity<Void> eliminarUsuario(@PathVariable Integer id) {
        usuarioService.eliminarUsuario(id);
        return ResponseEntity.noContent().build();
    }
}
  