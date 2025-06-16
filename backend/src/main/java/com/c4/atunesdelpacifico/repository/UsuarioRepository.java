package com.c4.atunesdelpacifico.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.c4.atunesdelpacifico.model.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Integer>{
    Optional<Usuario> findByUsername(String username);
}
