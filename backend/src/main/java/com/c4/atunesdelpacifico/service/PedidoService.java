package com.c4.atunesdelpacifico.service;

import com.c4.atunesdelpacifico.model.Lote;
import com.c4.atunesdelpacifico.model.Pedido;
import com.c4.atunesdelpacifico.model.Producto;
import com.c4.atunesdelpacifico.model.DetallePedido;
import com.c4.atunesdelpacifico.repository.PedidoRepository;
import com.c4.atunesdelpacifico.repository.LoteRepository;
import com.c4.atunesdelpacifico.repository.DetallePedidoRepository;
import com.c4.atunesdelpacifico.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class PedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private LoteRepository loteRepository;

    @Autowired
    private DetallePedidoRepository detallePedidoRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Transactional
    public Pedido crearPedido(Pedido pedido) {
        if (pedido.getCliente() == null || pedido.getCliente().getId() == null) {
            throw new IllegalArgumentException("El cliente es obligatorio");
        }
        if (pedido.getDetallePedidos() == null || pedido.getDetallePedidos().isEmpty()) {
            throw new IllegalArgumentException("Debe haber al menos un detalle de pedido");
        }
        // Inicializar campos obligatorios
        if (pedido.getEstado() == null) {
            pedido.setEstado(Pedido.EstadoPedido.Pendiente);
        }
        if (pedido.getFechaPedido() == null) {
            pedido.setFechaPedido(new java.sql.Date(new Date().getTime()));
        }
        if (pedido.getFechaEntrega() == null) {
            java.util.Calendar cal = java.util.Calendar.getInstance();
            cal.setTime(new Date());
            cal.add(java.util.Calendar.DAY_OF_MONTH, 3);
            pedido.setFechaEntrega(new java.sql.Date(cal.getTimeInMillis()));
        }
        Double total = 0.0;
        for (DetallePedido detalle : pedido.getDetallePedidos()) {
            if (detalle.getProducto() == null || detalle.getProducto().getNombre() == null) {
                throw new IllegalArgumentException("El producto es obligatorio en el detalle del pedido");
            }
            // Buscar el producto persistente por nombre
            Producto productoPersistente = productoRepository.findByNombre(detalle.getProducto().getNombre());
            if (productoPersistente == null) {
                throw new RuntimeException("Producto no encontrado con nombre: " + detalle.getProducto().getNombre());
            }
            detalle.setProducto(productoPersistente);
            if (detalle.getLote() == null || detalle.getLote().getId() == null) {
                // Buscar un lote disponible para el producto
                Optional<Lote> loteOpt = loteRepository.findFirstByProducto_NombreAndEstadoAndQuantityGreaterThan(
                    detalle.getProducto().getNombre(), Lote.EstadoLote.Disponible, detalle.getCantidad() - 1
                );
                if (loteOpt.isEmpty()) {
                    throw new RuntimeException("No hay lotes disponibles para el producto: " + detalle.getProducto().getNombre());
                }
                Lote lote = loteOpt.get();
                if (lote.getCantidad() < detalle.getCantidad()) {
                    throw new RuntimeException("Cantidad insuficiente en lotes disponibles para: " + detalle.getProducto().getNombre());
                }
                detalle.setLote(lote); // Asignar el lote encontrado
            } else {
                // Validar lote preasignado
                Optional<Lote> loteOpt = loteRepository.findById(detalle.getLote().getId());
                if (loteOpt.isEmpty()) {
                    throw new RuntimeException("Lote no encontrado");
                }
                Lote lote = loteOpt.get();
                if (lote.getEstado() != Lote.EstadoLote.Disponible || lote.getCantidad() < detalle.getCantidad()) {
                    throw new RuntimeException("Lote no disponible o cantidad insuficiente");
                }
                // Verificar que el lote corresponda al producto
                if (!lote.getProducto().getNombre().equals(detalle.getProducto().getNombre())) {
                    throw new RuntimeException("El lote no corresponde al producto seleccionado");
                }
            }
            Lote lote = detalle.getLote();
            // Calcular subtotal basado en el precio del producto del lote
            Double precioUnitario = lote.getProducto().getPrecio();
            detalle.setSubtotal(precioUnitario * detalle.getCantidad());
            total += precioUnitario * detalle.getCantidad(); // Corrección del cálculo de total
            lote.setCantidad(lote.getCantidad() - detalle.getCantidad());
            loteRepository.save(lote);
            detalle.setPedido(pedido); // Establecer la relación
        }
        pedido.setTotal(total); // Calcular total
        return pedidoRepository.save(pedido);
    }

    public List<Pedido> consultarPedidos(Integer clienteId, String estado) {
        if (clienteId != null && estado != null) {
            return pedidoRepository.findByCliente_IdAndEstado(clienteId, Pedido.EstadoPedido.valueOf(estado));
        } else if (clienteId != null) {
            return pedidoRepository.findByCliente_Id(clienteId);
        } else if (estado != null) {
            return pedidoRepository.findByEstado(Pedido.EstadoPedido.valueOf(estado));
        }
        return pedidoRepository.findAll();
    }

    public Pedido actualizarEstado(Integer id, String nuevoEstado) {
        Pedido pedido = pedidoRepository.findById(id).orElseThrow(() -> new RuntimeException("Pedido no encontrado"));
        if (nuevoEstado.equals("Enviado") || nuevoEstado.equals("Cancelado")) {
            for (DetallePedido detalle : pedido.getDetallePedidos()) {
                Optional<Lote> lote = loteRepository.findById(detalle.getLote().getId());
                if (lote.isPresent() && nuevoEstado.equals("Cancelado")) {
                    lote.get().setCantidad(lote.get().getCantidad() + detalle.getCantidad());
                    loteRepository.save(lote.get());
                }
            }
        }
        Pedido.EstadoPedido estadoEnum;
        try {
            estadoEnum = Pedido.EstadoPedido.valueOf(nuevoEstado.replace(" ", "_"));
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Estado inválido. Los valores permitidos son: Pendiente, En_Proceso, Enviado, Cancelado");
        }
        pedido.setEstado(estadoEnum);
        return pedidoRepository.save(pedido);
    }

    public List<DetallePedido> consultarDetallesPorPedido(Integer pedidoId) {
        return detallePedidoRepository.findByPedido_Id(pedidoId);
    }

    public void eliminarPedido(Integer id) {
        Optional<Pedido> pedido = pedidoRepository.findById(id);
        if (pedido.isEmpty()) {
            throw new IllegalArgumentException("Pedido no encontrado");
        }
        if (pedido.get().getEstado() != Pedido.EstadoPedido.Cancelado) {
            throw new IllegalStateException("Solo se pueden eliminar pedidos en estado Cancelado");
        }
        pedidoRepository.deleteById(id);
    }
}