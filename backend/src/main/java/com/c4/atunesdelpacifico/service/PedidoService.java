package com.c4.atunesdelpacifico.service;

import com.c4.atunesdelpacifico.model.Lote;
import com.c4.atunesdelpacifico.model.Pedido;
import com.c4.atunesdelpacifico.model.DetallePedido;
import com.c4.atunesdelpacifico.repository.PedidoRepository;
import com.c4.atunesdelpacifico.repository.LoteRepository;
import com.c4.atunesdelpacifico.repository.DetallePedidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

    public Pedido crearPedido(Pedido pedido) {
        if (pedido.getCliente() == null || pedido.getCliente().getId() == null) {
            throw new IllegalArgumentException("El cliente es obligatorio");
        }
        if (pedido.getDetallePedidos() == null || pedido.getDetallePedidos().isEmpty()) {
            throw new IllegalArgumentException("Debe haber al menos un detalle de pedido");
        }
        Double total = 0.0;
        for (DetallePedido detalle : pedido.getDetallePedidos()) {
            Optional<Lote> lote = loteRepository.findById(detalle.getLote().getId());
            if (lote.isEmpty() || lote.get().getCantidad() < detalle.getCantidad()) {
                throw new RuntimeException("Lote no disponible o cantidad insuficiente");
            }
            total += detalle.getSubtotal();
            lote.get().setCantidad(lote.get().getCantidad() - detalle.getCantidad());
            loteRepository.save(lote.get());
            detalle.setPedido(pedido); // Establecer la relación
        }
        pedido.setTotal(total); // Calcular total
        return pedidoRepository.save(pedido);
    }

    public List<Pedido> consultarPedidos() {
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
        // Convertir String a Enum EstadoPedido
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

    public List<DetallePedido> consultarDetallesPorLote(Integer loteId) {
        return detallePedidoRepository.findByLote_Id(loteId);
    }
}