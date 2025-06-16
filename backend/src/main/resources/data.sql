-- Tabla de roles de usuario
INSERT INTO roles (nombre) VALUES 
('Administrador'),
('Operador'),
('Cliente');

-- Tabla de usuarios con contraseñas cifradas con BCrypt
-- Contraseñas originales:
-- admin     → admin123
-- operador1 → op1234567
-- cliente1  → cli1234567

INSERT INTO usuarios (username, password, correo, rol_id) VALUES 
('admin', '$2a$10$Hu4JkoCM5.6c7Y8f7wUJyuDvJIQ2JcCsutkqwYERCSzQR17B4D1WG', 'admin@atunes.com', 1),
('operador1', '$2a$10$Ms6wYFPm42.pORrSgOV9..da5zsa.TK19CPzAHFnSwisIRdtLVjgG', 'operador@atunes.com', 2),
('cliente1', '$2a$10$OZPyoTeb57brd2awZEkYheGHsIF2.5nGwhaU6d1GAXPN2Pgf2GyKq', 'cliente@empresa.com', 3);

-- Clientes
INSERT INTO clientes (nombre, identificacion, correo, telefono, direccion, estado) VALUES 
('Distribuidora Norte', '900123456', 'contacto@norte.com', '3001234567', 'Calle 10 #5-20, Bogotá', 'Activo'),
('Supermercado Sur', '800654321', 'ventas@sur.com', '3119876543', 'Carrera 20 #45-10, Cali', 'Activo');

-- Productos
INSERT INTO productos (nombre, descripcion) VALUES 
('Atun_en_aceite', 'Lata de atún en aceite vegetal, 170g'),
('Atun_en_agua', 'Lata de atún en agua, 170g'),
('Atun_en_salsa', 'Lata de atún en salsa criolla, 170g');


-- Lotes
INSERT INTO lotes (codigo_lote, fecha_produccion, producto_id, cantidad, estado) VALUES 
('L001', '2025-06-01', 1, 1000, 'Disponible'),
('L002', '2025-06-02', 2, 800, 'Disponible'),
('L003', '2025-06-03', 3, 600, 'Defectuoso'),
('L004', '2025-06-04', 1, 1200, 'Disponible');

-- Pedidos
INSERT INTO pedidos (cliente_id, fecha_pedido, fecha_entrega, total, estado) VALUES 
(1, '2025-06-10', '2025-06-13', 350000.00, 'En Proceso'),
(2, '2025-06-11', '2025-06-14', 220000.00, 'Pendiente');

-- Detalle de pedidos
INSERT INTO detalle_pedido (pedido_id, lote_id, cantidad, subtotal) VALUES 
(1, 1, 200, 70000.00),
(1, 2, 300, 90000.00),
(1, 4, 400, 190000.00),
(2, 2, 200, 60000.00),
(2, 4, 300, 160000.00);
