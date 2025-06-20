package com.c4.atunesdelpacifico.controller;

import com.c4.atunesdelpacifico.model.Producto;
import com.c4.atunesdelpacifico.service.ProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/productos")
public class ProductoController {

    @Autowired
    private ProductoService productoService;

    @GetMapping
    public ResponseEntity<List<Producto>> consultarProductos() {
        return ResponseEntity.ok(productoService.consultarProductos());
    }
}