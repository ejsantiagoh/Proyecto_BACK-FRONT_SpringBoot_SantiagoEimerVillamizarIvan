package com.c4.atunesdelpacifico.service;

import com.c4.atunesdelpacifico.model.Usuario;
import com.c4.atunesdelpacifico.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + username));
            System.out.println("Entró a loadUserByUsername: " + username); // verificando que lo use
        return org.springframework.security.core.userdetails.User
            .withUsername(usuario.getUsername())
            .password(usuario.getPassword())
            .roles(usuario.getRol().getNombre())
            .build();
        
    }
    

}