package com.c4.atunesdelpacifico.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.c4.atunesdelpacifico.model.Cliente;

public interface ClienteRepository extends JpaRepository<Cliente, Integer>{
    List<Cliente> findByEstado(Cliente.EstadoCliente estado);
    Optional<Cliente> findByIdentificacion(String identificacion);

    @Query("SELECT c FROM Cliente c WHERE c.usuario.id = :usuarioId")
    Optional<Cliente> findByUsuario_Id(Integer usuarioId);
}
