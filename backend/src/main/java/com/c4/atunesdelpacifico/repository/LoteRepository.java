package com.c4.atunesdelpacifico.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.c4.atunesdelpacifico.model.Lote;
import com.c4.atunesdelpacifico.model.Lote.EstadoLote;

public interface LoteRepository extends JpaRepository<Lote, Integer>{
    List<Lote> findByFechaProduccion(Date fechaProduccion);
    List<Lote> findByEstado(EstadoLote estado);
    List<Lote> findByFechaProduccionAndEstado(Date fechaProduccion, EstadoLote estado);

    @Query("SELECT l FROM Lote l JOIN l.producto p WHERE p.nombre = :tipo")
    List<Lote> findByProductoNombre(String tipo);
}
