package com.c4.atunesdelpacifico.controller;

import com.c4.atunesdelpacifico.model.Lote;
import com.c4.atunesdelpacifico.service.LoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/operador/lotes")
public class LoteController {   

    @Autowired
    private LoteService loteService;

    @PostMapping
    public ResponseEntity<Lote> registrarLote(@RequestBody Lote lote) {
        Lote nuevoLote = loteService.registrarLote(lote);
        return ResponseEntity.ok(nuevoLote);
    }

    @GetMapping
    public ResponseEntity<List<Lote>> consultarInventario(
            @RequestParam(required = false) String tipo,
            @RequestParam(required = false) String fecha,
            @RequestParam(required = false) String estado) {
        List<Lote> inventario = loteService.consultarInventario(tipo, fecha, estado);
        return ResponseEntity.ok(inventario);
    }

    @PatchMapping("/{id}/defectuoso")
    public ResponseEntity<Lote> marcarDefectuoso(@PathVariable Integer id) {
        Lote loteActualizado = loteService.marcarDefectuoso(id);
        return ResponseEntity.ok(loteActualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarLote(@PathVariable Integer id) {
        loteService.eliminarLote(id);
        return ResponseEntity.noContent().build();
    }
}