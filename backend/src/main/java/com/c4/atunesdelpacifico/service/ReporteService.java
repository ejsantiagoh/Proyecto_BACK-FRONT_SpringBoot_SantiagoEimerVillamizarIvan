package com.c4.atunesdelpacifico.service;

import com.c4.atunesdelpacifico.model.Lote;
import com.c4.atunesdelpacifico.model.Pedido;
import com.c4.atunesdelpacifico.model.DetallePedido;
import com.c4.atunesdelpacifico.repository.LoteRepository;
import com.c4.atunesdelpacifico.repository.PedidoRepository;
import com.c4.atunesdelpacifico.repository.DetallePedidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ReporteService {

    @Autowired
    private LoteRepository loteRepository;

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private DetallePedidoRepository detallePedidoRepository;

    public Map<String, Object> generarReporteInventario() {
        Map<String, Object> reporte = new HashMap<>();
        List<Lote> lotes = loteRepository.findAll();
        reporte.put("totalLotes", lotes.size());
        reporte.put("lotesDisponibles", lotes.stream().filter(l -> "Disponible".equals(l.getEstado())).count());
        return reporte;
    }

    public Map<String, Object> generarReportePedidos() {
        Map<String, Object> reporte = new HashMap<>();
        List<Pedido> pedidos = pedidoRepository.findAll();
        reporte.put("totalPedidos", pedidos.size());
        reporte.put("pedidosEnProceso", pedidos.stream().filter(p -> "En Proceso".equals(p.getEstado())).count());
        return reporte;
    }

    public Map<String, Object> generarReporteVentasPorProducto() {
        Map<String, Object> reporte = new HashMap<>();
        List<DetallePedido> detalles = detallePedidoRepository.findAll();
        Map<String, Long> ventasPorTipo = detalles.stream()
            .collect(Collectors.groupingBy(
                d -> d.getLote().getProducto().getNombre().toString(),
                Collectors.counting()
            ));
        reporte.put("ventasPorTipo", ventasPorTipo);
        return reporte;
    }

    public Map<String, Object> generarReporteVentasPorCliente() {
        Map<String, Object> reporte = new HashMap<>();
        List<Pedido> pedidos = pedidoRepository.findAll();
        Map<String, Long> ventasPorCliente = pedidos.stream()
            .collect(Collectors.groupingBy(
                p -> p.getCliente().getNombre(),
                Collectors.counting()
            ));
        reporte.put("ventasPorCliente", ventasPorCliente);
        return reporte;
    }

    public Map<String, Object> generarReporteProduccion() {
        Map<String, Object> reporte = new HashMap<>();
        List<Lote> lotes = loteRepository.findAll();
        reporte.put("totalLotesProducidos", lotes.size());
        reporte.put("lotesDefectuosos", lotes.stream().filter(l -> "Defectuoso".equals(l.getEstado())).count());
        return reporte;
    }
}