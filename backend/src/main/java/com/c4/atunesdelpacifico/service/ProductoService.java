package com.c4.atunesdelpacifico.service;

import com.c4.atunesdelpacifico.model.Producto;
import com.c4.atunesdelpacifico.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.util.List;

@Service
public class ProductoService {

    @Autowired
    private ProductoRepository productoRepository;

    // @PostConstruct
    // public void init() {
    //     if (productoRepository.count() == 0) {
    //         Producto p1 = new Producto();
    //         p1.setNombre(Producto.TipoProducto.Atun_en_aceite);
    //         p1.setDescripcion("Atún en aceite de alta calidad");
    //         p1.setPrecio(2.50);

    //         Producto p2 = new Producto();
    //         p2.setNombre(Producto.TipoProducto.Atun_en_agua);
    //         p2.setDescripcion("Atún en agua light");
    //         p2.setPrecio(2.00);

    //         Producto p3 = new Producto();
    //         p3.setNombre(Producto.TipoProducto.Atun_en_salsa);
    //         p3.setDescripcion("Atún en salsa especial");
    //         p3.setPrecio(2.75);

    //         productoRepository.saveAll(List.of(p1, p2, p3));
    //     }
    // }

    public List<Producto> consultarProductos() {
        return productoRepository.findAll();
    }
}