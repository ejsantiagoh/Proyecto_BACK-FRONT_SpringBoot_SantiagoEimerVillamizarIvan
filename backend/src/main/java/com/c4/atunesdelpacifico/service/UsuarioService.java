package com.c4.atunesdelpacifico.service;

import com.c4.atunesdelpacifico.model.Cliente;
import com.c4.atunesdelpacifico.model.Rol;
import com.c4.atunesdelpacifico.model.Usuario;
import com.c4.atunesdelpacifico.repository.RolRepository;
import com.c4.atunesdelpacifico.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private RolRepository rolRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Usuario registrarUsuario(Usuario usuario) {
        if (usuario.getUsername() == null || usuario.getUsername().isEmpty()) {
            throw new IllegalArgumentException("El nombre de usuario es obligatorio");
        }
        if (usuarioRepository.findByUsername(usuario.getUsername()).isPresent() && usuario.getId() == null) {
            throw new IllegalArgumentException("El nombre de usuario ya existe");
        }
        if (usuario.getRol() == null || usuario.getRol().getId() == null) {
            throw new IllegalArgumentException("El rol es obligatorio");
        }
        Optional<Rol> rol = rolRepository.findById(usuario.getRol().getId());
        if (rol.isEmpty()) {
            throw new RuntimeException("Rol no encontrado");
        }
        usuario.setRol(rol.get());
        // Encriptar la contraseña solo si se proporciona un nuevo valor
        if (usuario.getPassword() != null && !usuario.getPassword().isEmpty()) {
            usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        }
        return usuarioRepository.save(usuario);
    }

    public Usuario actualizarRol(Integer id, Integer nuevoRolId) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(id);
        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();
            Optional<Rol> nuevoRol = rolRepository.findById(nuevoRolId);
            if (nuevoRol.isEmpty()) {
                throw new RuntimeException("Rol no encontrado");
            }
            usuario.setRol(nuevoRol.get());
            return usuarioRepository.save(usuario);
        } else {
            throw new RuntimeException("Usuario no encontrado");
        }
    }

    public void eliminarUsuario(Integer id) {
        Optional<Usuario> usuario = usuarioRepository.findById(id);
        if (usuario.isEmpty()) {
            throw new IllegalArgumentException("Usuario no encontrado");
        }
        if (usuario.get().getRol().getId() == 1) { // rol_id=1 es Administrador
            throw new IllegalStateException("No se puede eliminar un usuario Administrador");
        }
        // Verificar si el usuario tiene un Cliente asociado
        if (usuarioRepository.countClientesByUsuarioId(id) > 0) {
            throw new IllegalStateException("No se puede eliminar el usuario porque está asociado a un cliente. Elimine el cliente asociado primero.");
        }
        usuarioRepository.deleteById(id);
    }

    public List<Usuario> consultarTodosLosUsuarios() {
        return usuarioRepository.findAll();
    }

    public Usuario findByUsername(String username) {
        return usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado: " + username));
    }

    public Usuario findById(Integer id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + id));
    }
}