package com.c4.atunesdelpacifico.service;

import com.c4.atunesdelpacifico.model.Producto;
import com.c4.atunesdelpacifico.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

// import jakarta.annotation.PostConstruct;
import java.util.List;

@Service
public class ProductoService {

    @Autowired
    private ProductoRepository productoRepository;

    public List<Producto> consultarProductos() {
        return productoRepository.findAll();
    }
}