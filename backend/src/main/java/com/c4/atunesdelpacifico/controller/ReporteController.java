package com.c4.atunesdelpacifico.controller;

import com.c4.atunesdelpacifico.service.ReporteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/reportes")
public class ReporteController {

    @Autowired
    private ReporteService reporteService;

    @GetMapping("/inventario")
    public ResponseEntity<Map<String, Object>> generarReporteInventario() {
        return ResponseEntity.ok(reporteService.generarReporteInventario());
    }

    @GetMapping("/pedidos") // revisar
    public ResponseEntity<Map<String, Object>> generarReportePedidos() {
        return ResponseEntity.ok(reporteService.generarReportePedidos());
    }
}
