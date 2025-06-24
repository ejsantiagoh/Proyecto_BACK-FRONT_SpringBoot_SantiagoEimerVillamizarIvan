package com.c4.atunesdelpacifico.controller;

import com.c4.atunesdelpacifico.service.ReporteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/reportes")
public class ReporteController {

    @Autowired
    private ReporteService reporteService;

    @GetMapping("/inventario")
    public ResponseEntity<Map<String, Object>> obtenerReporteInventario() {
        return ResponseEntity.ok(reporteService.generarReporteInventario());
    }

    @GetMapping("/pedidos")
    public ResponseEntity<Map<String, Object>> obtenerReportePedidos() {
        return ResponseEntity.ok(reporteService.generarReportePedidos());
    }

    @GetMapping("/ventas-producto")
    public ResponseEntity<Map<String, Object>> obtenerReporteVentasPorProducto() {
        return ResponseEntity.ok(reporteService.generarReporteVentasPorProducto());
    }

    @GetMapping("/ventas-cliente")
    public ResponseEntity<Map<String, Object>> obtenerReporteVentasPorCliente() {
        return ResponseEntity.ok(reporteService.generarReporteVentasPorCliente());
    }

    @GetMapping("/produccion")
    public ResponseEntity<Map<String, Object>> obtenerReporteProduccion() {
        return ResponseEntity.ok(reporteService.generarReporteProduccion());
    }
}