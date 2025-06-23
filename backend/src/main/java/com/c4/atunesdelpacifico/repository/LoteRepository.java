package com.c4.atunesdelpacifico.repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.c4.atunesdelpacifico.model.Lote;
import com.c4.atunesdelpacifico.model.Lote.EstadoLote;
import com.c4.atunesdelpacifico.model.Producto;

public interface LoteRepository extends JpaRepository<Lote, Integer> {
    List<Lote> findByFechaProduccion(Date fechaProduccion);
    List<Lote> findByEstado(EstadoLote estado);
    List<Lote> findByFechaProduccionAndEstado(Date fechaProduccion, EstadoLote estado);

    @Query("SELECT l FROM Lote l JOIN l.producto p WHERE p.nombre = :tipo")
    List<Lote> findByProductoNombre(String tipo);

    @Query("SELECT l FROM Lote l WHERE l.producto.nombre = :nombre AND l.estado = :estado AND l.cantidad > :cantidad ORDER BY l.id ASC LIMIT 1")
    Optional<Lote> findFirstByProducto_NombreAndEstadoAndQuantityGreaterThan(Producto.TipoProducto nombre, Lote.EstadoLote estado, Integer cantidad);
}