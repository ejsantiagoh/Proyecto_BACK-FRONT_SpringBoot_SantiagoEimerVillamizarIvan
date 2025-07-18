package com.c4.atunesdelpacifico.service;

import com.c4.atunesdelpacifico.model.DetallePedido;
import com.c4.atunesdelpacifico.model.Lote;
import com.c4.atunesdelpacifico.model.Pedido;
import com.c4.atunesdelpacifico.model.Producto;
import com.c4.atunesdelpacifico.repository.DetallePedidoRepository;
import com.c4.atunesdelpacifico.repository.LoteRepository;
import com.c4.atunesdelpacifico.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LoteService {

    @Autowired
    private LoteRepository loteRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired 
    private DetallePedidoRepository detallePedidoRepository;

    public Lote registrarLote(Lote lote) {
        if (lote.getCantidad() <= 0) {
            throw new IllegalArgumentException("La cantidad debe ser mayor a 0");
        }
        if (lote.getProducto() == null || lote.getProducto().getId() == null) {
            throw new IllegalArgumentException("El producto es obligatorio");
        }
        Optional<Producto> producto = productoRepository.findById(lote.getProducto().getId());
        if (producto.isEmpty()) {
            throw new RuntimeException("Producto no encontrado");
        }
        lote.setProducto(producto.get());
        return loteRepository.save(lote);
    }

    public List<Lote> consultarInventario(String tipo, String fecha, String estado) {
        if (tipo != null && !tipo.isEmpty()) {
            try {
                String tipoNormalizado = tipo.replace(" ", "_").replace("-", "_");
                Producto.TipoProducto.valueOf(tipoNormalizado);
                return loteRepository.findByProductoNombre(tipoNormalizado);
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Tipo de producto no válido. Los valores permitidos son: Atun_en_aceite, Atun_en_agua, Atun_en_salsa");
            }
        } else if (fecha != null && !fecha.isEmpty() && estado != null && !estado.isEmpty()) {
            return loteRepository.findByFechaProduccionAndEstado(java.sql.Date.valueOf(fecha), Lote.EstadoLote.valueOf(estado));
        } else if (fecha != null && !fecha.isEmpty()) {
            return loteRepository.findByFechaProduccion(java.sql.Date.valueOf(fecha));
        } else if (estado != null && !estado.isEmpty()) {
            return loteRepository.findByEstado(Lote.EstadoLote.valueOf(estado));
        }
        return loteRepository.findAll();
    }

    public Lote marcarDefectuoso(Integer id) {
        Optional<Lote> loteOpt = loteRepository.findById(id);
        if (loteOpt.isPresent()) {
            Lote lote = loteOpt.get();
            if (lote.getEstado() == Lote.EstadoLote.Vendido) {
                throw new IllegalStateException("No se puede marcar como defectuoso un lote ya vendido");
            }
            // Verificar si el lote está asociado a pedidos pendientes
            List<DetallePedido> detallesPendientes = detallePedidoRepository.findByLote_Id(id)
                    .stream()
                    .filter(d -> d.getPedido().getEstado() != Pedido.EstadoPedido.Cancelado)
                    .toList();
            if (!detallesPendientes.isEmpty()) {
                throw new IllegalStateException("No se puede marcar como defectuoso un lote asociado a pedidos pendientes");
            }
            lote.setEstado(Lote.EstadoLote.Defectuoso);
            return loteRepository.save(lote);
        } else {
            throw new RuntimeException("Lote no encontrado");
        }
    }

    public void eliminarLote(Integer id) {
        Optional<Lote> lote = loteRepository.findById(id);
        if (lote.isEmpty()) {
            throw new IllegalArgumentException("Lote no encontrado");
        }
        if (lote.get().getEstado() == Lote.EstadoLote.Disponible) {
            throw new IllegalStateException("No se puede eliminar un lote en estado Disponible");
        }
        loteRepository.deleteById(id);
    }
}