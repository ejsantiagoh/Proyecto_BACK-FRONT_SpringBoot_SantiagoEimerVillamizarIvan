package com.c4.atunesdelpacifico.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.c4.atunesdelpacifico.model.Cliente;

public interface ClienteRepository extends JpaRepository<Cliente, Integer>{
    List<Cliente> findByEstado(Cliente.EstadoCliente estado);
    Optional<Cliente> findByIdentificacion(String identificacion);
}
