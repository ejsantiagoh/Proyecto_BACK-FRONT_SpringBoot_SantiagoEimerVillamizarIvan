package com.c4.atunesdelpacifico.service;

import com.c4.atunesdelpacifico.model.Usuario;
import com.c4.atunesdelpacifico.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + username));
            System.out.println("Entró a loadUserByUsername: " + username); // verificando que lo use
        return User.builder()
            .username(usuario.getUsername())
            .password(usuario.getPassword())
            .roles(usuario.getRol().getNombre()) // Pasamos solo el nombre del rol, sin "ROLE_"
            .build();
        
    }
    

}