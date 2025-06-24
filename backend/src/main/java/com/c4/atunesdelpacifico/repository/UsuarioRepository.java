package com.c4.atunesdelpacifico.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.c4.atunesdelpacifico.model.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Integer>{
    Optional<Usuario> findByUsername(String username);
    
    @Query("SELECT COUNT(c) FROM Cliente c WHERE c.usuario.id = ?1")
    long countClientesByUsuarioId(Integer id);
}
