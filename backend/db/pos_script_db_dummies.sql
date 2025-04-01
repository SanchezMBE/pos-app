USE pos_app;

-- Inserción de negocios
INSERT INTO business (name, address, phone, email) VALUES
('Abarrotes Papu', 'Av. Revolución 123, Ciudad de México', '5512345678', 'contacto@abarrotespapu.com'),
('Abarrotes Don Pepe', 'Calle Hidalgo 456, Guadalajara', '3398765432', 'info@abarrotesdonpepe.com');

-- Inserción de usuarios (administradores y cajeros)
-- Para Abarrotes Papu (business_id = 1)
INSERT INTO user (business_id, username, password, full_name, role) VALUES
(1, 'comandante', '$2y$10$WmL7Yfw.HmEwQ6pBcpLY7OdTIQ9w/nwQRqQtb3.WrK29O9pZJJYKi', 'Fernando Gómez', 'admin'),
(1, 'laura', '$2y$10$xDef.4h/8.WnQyjz1bxZ.Oez.oo4MxLf5RhRdhgwMcLGE5c0qN2Hy', 'Laura Sánchez', 'cashier'),
(1, 'miguel', '$2y$10$TtLFCvpQHYbGR/XHdEiJJ.Z/gFOd/kYjQmR.fX3J9g1e04v.7d2.y', 'Miguel Hernández', 'cashier');

-- Para Abarrotes Don Pepe (business_id = 2)
INSERT INTO user (business_id, username, password, full_name, role) VALUES
(2, 'chelis', '$2y$10$ScPP3RcL5pFgzAp2qXKwIOXf8uLnJsHTl7T2QHZB9CcRQ0b.VH3m6', 'José Luis Sánchez', 'admin'),
(2, 'carmen', '$2y$10$JbNWA.WVPrT0jXMI.YRzueLuJLpKl4UVy/fvGLNhH1LBbTcEqUZ6q', 'Carmen Rodríguez', 'cashier'),
(2, 'javier', '$2y$10$QXnRbxL9YOoTwFGjnxXwD.2LtPnp5.KQgbL3IgPq/X3rMg0kD9tqm', 'Javier López', 'cashier');

-- Inserción de categorías
INSERT INTO category (name, description) VALUES
('Abarrotes', 'Productos básicos y alimentos no perecederos'),
('Lácteos', 'Leche, queso, yogurt y otros productos lácteos'),
('Bebidas', 'Refrescos, agua, jugos y bebidas alcohólicas'),
('Limpieza', 'Productos para limpieza del hogar'),
('Botanas', 'Frituras, galletas, dulces y snacks');

-- Inserción de artículos para Abarrotes Papu (business_id = 1)
INSERT INTO article (business_id, category_id, description, code, barcode, price, cost, stock) VALUES
-- Categoría: Abarrotes
(1, 1, 'Arroz 1kg', 'AP001', '7501000123457', 25.50, 20.00, 100),
(1, 1, 'Frijol 1kg', 'AP002', '7501000123458', 32.00, 26.00, 80),
(1, 1, 'Aceite 1L', 'AP003', '7501000123459', 38.50, 31.00, 60),
(1, 1, 'Azúcar 1kg', 'AP004', '7501000123460', 28.90, 23.00, 75),

-- Categoría: Lácteos
(1, 2, 'Leche entera 1L', 'AP005', '7501000123461', 24.50, 19.50, 50),
(1, 2, 'Queso panela 400g', 'AP006', '7501000123462', 45.00, 36.00, 30),
(1, 2, 'Yogurt natural 1L', 'AP007', '7501000123463', 32.50, 26.00, 40),
(1, 2, 'Crema 500ml', 'AP008', '7501000123464', 39.00, 31.20, 25),

-- Categoría: Bebidas
(1, 3, 'Refresco cola 2L', 'AP009', '7501000123465', 29.90, 24.00, 120),
(1, 3, 'Agua mineral 1.5L', 'AP010', '7501000123466', 18.50, 14.80, 150),
(1, 3, 'Jugo de naranja 1L', 'AP011', '7501000123467', 26.00, 20.80, 45),
(1, 3, 'Cerveza lata 355ml', 'AP012', '7501000123468', 22.00, 17.60, 200),

-- Categoría: Limpieza
(1, 4, 'Detergente 1kg', 'AP013', '7501000123469', 42.50, 34.00, 60),
(1, 4, 'Cloro 1L', 'AP014', '7501000123470', 19.90, 15.92, 70),
(1, 4, 'Jabón de baño', 'AP015', '7501000123471', 16.50, 13.20, 100),
(1, 4, 'Papel higiénico 4 rollos', 'AP016', '7501000123472', 35.90, 28.72, 80),

-- Categoría: Botanas
(1, 5, 'Papas fritas 150g', 'AP017', '7501000123473', 28.50, 22.80, 65),
(1, 5, 'Galletas surtidas 500g', 'AP018', '7501000123474', 32.00, 25.60, 50),
(1, 5, 'Chocolate 100g', 'AP019', '7501000123475', 22.50, 18.00, 70),
(1, 5, 'Palomitas 100g', 'AP020', '7501000123476', 18.90, 15.12, 85);

-- Inserción de artículos para Abarrotes Don Pepe (business_id = 2)
INSERT INTO article (business_id, category_id, description, code, barcode, price, cost, stock) VALUES
-- Categoría: Abarrotes
(2, 1, 'Arroz premium 1kg', 'DP001', '7502000123457', 28.50, 22.80, 90),
(2, 1, 'Frijol negro 1kg', 'DP002', '7502000123458', 34.00, 27.20, 70),
(2, 1, 'Aceite de oliva 500ml', 'DP003', '7502000123459', 65.50, 52.40, 40),
(2, 1, 'Azúcar refinada 1kg', 'DP004', '7502000123460', 30.90, 24.72, 65),

-- Categoría: Lácteos
(2, 2, 'Leche deslactosada 1L', 'DP005', '7502000123461', 27.50, 22.00, 45),
(2, 2, 'Queso oaxaca 400g', 'DP006', '7502000123462', 52.00, 41.60, 25),
(2, 2, 'Yogurt griego 500g', 'DP007', '7502000123463', 38.50, 30.80, 35),
(2, 2, 'Mantequilla 250g', 'DP008', '7502000123464', 42.00, 33.60, 20),

-- Categoría: Bebidas
(2, 3, 'Refresco sabores 2L', 'DP009', '7502000123465', 27.90, 22.32, 110),
(2, 3, 'Agua purificada 2L', 'DP010', '7502000123466', 15.50, 12.40, 160),
(2, 3, 'Jugo de manzana 1L', 'DP011', '7502000123467', 28.00, 22.40, 40),
(2, 3, 'Cerveza oscura 355ml', 'DP012', '7502000123468', 24.00, 19.20, 180),

-- Categoría: Limpieza
(2, 4, 'Detergente líquido 1L', 'DP013', '7502000123469', 46.50, 37.20, 55),
(2, 4, 'Limpiador multiusos 1L', 'DP014', '7502000123470', 23.90, 19.12, 65),
(2, 4, 'Jabón líquido 500ml', 'DP015', '7502000123471', 35.50, 28.40, 45),
(2, 4, 'Papel higiénico 8 rollos', 'DP016', '7502000123472', 62.90, 50.32, 40),

-- Categoría: Botanas
(2, 5, 'Doritos 180g', 'DP017', '7502000123473', 32.50, 26.00, 60),
(2, 5, 'Galletas surtidas premium', 'DP018', '7502000123474', 38.00, 30.40, 45),
(2, 5, 'Chocolate oscuro 80g', 'DP019', '7502000123475', 36.50, 29.20, 35),
(2, 5, 'Nueces mixtas 250g', 'DP020', '7502000123476', 65.90, 52.72, 30);

-- Creación de cash audits (aperturas de caja)
-- Para Abarrotes Papu
INSERT INTO cash_audit (business_id, user_id, start_date, end_date, initial_balance, final_balance, total_sales) VALUES
(1, 1, '2025-03-31 08:00:00', '2025-03-31 20:00:00', 1000.00, 3245.60, 2245.60),
(1, 1, '2025-04-01 08:00:00', NULL, 1500.00, 1500.00, 0.00);

-- Para Abarrotes Don Pepe
INSERT INTO cash_audit (business_id, user_id, start_date, end_date, initial_balance, final_balance, total_sales) VALUES
(2, 4, '2025-03-31 09:00:00', '2025-03-31 21:00:00', 1200.00, 4320.80, 3120.80),
(2, 4, '2025-04-01 09:00:00', NULL, 1800.00, 1800.00, 0.00);

-- Creación de algunas ventas para el día anterior
-- Para Abarrotes Papu
INSERT INTO sale (business_id, user_id, cash_audit_id, sale_date, total) VALUES
(1, 2, 1, '2025-03-31 10:15:00', 225.50),
(1, 3, 1, '2025-03-31 12:30:00', 182.40),
(1, 2, 1, '2025-03-31 15:45:00', 318.70);

-- Para Abarrotes Don Pepe
INSERT INTO sale (business_id, user_id, cash_audit_id, sale_date, total) VALUES
(2, 5, 3, '2025-03-31 11:20:00', 245.30),
(2, 6, 3, '2025-03-31 14:10:00', 198.90),
(2, 5, 3, '2025-03-31 17:25:00', 376.50);

-- Detalles de venta para Abarrotes Papu
INSERT INTO sale_detail (sale_id, article_id, quantity, unit_price, total_price) VALUES
-- Venta 1
(1, 1, 2, 25.50, 51.00),
(1, 5, 3, 24.50, 73.50),
(1, 9, 1, 29.90, 29.90),
(1, 17, 2, 28.50, 57.00),
-- Venta 2
(2, 3, 1, 38.50, 38.50),
(2, 7, 2, 32.50, 65.00),
(2, 10, 1, 18.50, 18.50),
(2, 14, 3, 19.90, 59.70),
-- Venta 3
(3, 2, 2, 32.00, 64.00),
(3, 12, 4, 22.00, 88.00),
(3, 15, 3, 16.50, 49.50),
(3, 19, 5, 22.50, 112.50);

-- Detalles de venta para Abarrotes Don Pepe
INSERT INTO sale_detail (sale_id, article_id, quantity, unit_price, total_price) VALUES
-- Venta 4
(4, 21, 2, 28.50, 57.00),
(4, 25, 1, 27.50, 27.50),
(4, 29, 2, 27.90, 55.80),
(4, 37, 3, 32.50, 97.50),
-- Venta 5
(5, 23, 1, 65.50, 65.50),
(5, 26, 1, 52.00, 52.00),
(5, 32, 1, 24.00, 24.00),
(5, 38, 1, 38.00, 38.00),
-- Venta 6
(6, 24, 2, 30.90, 61.80),
(6, 28, 1, 42.00, 42.00),
(6, 36, 1, 62.90, 62.90),
(6, 40, 3, 65.90, 197.70);