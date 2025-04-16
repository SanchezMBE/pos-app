DROP DATABASE IF EXISTS pos_app;
CREATE DATABASE pos_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE pos_app;

-- Table for businesses (negocio)
CREATE TABLE business
(
    id          INT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    address     VARCHAR(255) NULL,
    phone       VARCHAR(15)  NULL,
    email       VARCHAR(100) NULL
);

-- Table for users (roles: admin, cashier, etc.)
CREATE TABLE user
(
    id          INT AUTO_INCREMENT PRIMARY KEY,
    business_id INT NOT NUll,  -- link to the business that owns the user
    username    VARCHAR(50)  NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,  -- hashed password
    full_name   VARCHAR(255) NOT NULL,
    role        ENUM('admin', 'cashier') NOT NULL,  -- defining roles
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table for categories (product categories)
CREATE TABLE category
(
    id          INT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(255) NOT NULL UNIQUE,
    description TEXT         NULL
);

-- Table for articles (products), now linked to category and business
CREATE TABLE article
(
    id          INT AUTO_INCREMENT PRIMARY KEY,
    business_id INT NOT NULL,  -- link to the business that owns the article
    category_id INT NOT NULL,  -- foreign key to category
    description VARCHAR(255) NOT NULL,
    code        VARCHAR(255) NULL,
    barcode     VARCHAR(13)  NULL,
    price       FLOAT        NOT NULL,
    cost        FLOAT        NULL,
    stock       INT        NULL,
    CONSTRAINT barcode UNIQUE (barcode),
    CONSTRAINT code UNIQUE (code),
    FOREIGN KEY (category_id) REFERENCES category(id),
    FOREIGN KEY (business_id) REFERENCES business(id)
);

-- Table for cash audit (apertura y cierre de caja)
CREATE TABLE cash_audit
(
    id              INT AUTO_INCREMENT PRIMARY KEY,
    business_id     INT NOT NULL,  -- linked to the business
    user_id         INT NOT NULL,  -- the user who started the cash audit (opened the cash)
    start_date      DATETIME NOT NULL,
    end_date        DATETIME NULL,  -- will be null until the cash audit is closed
    initial_balance FLOAT    NOT NULL,  -- initial balance at the start of the cash audit
    final_balance   FLOAT    NOT NULL,  -- final balance at the end of the cash audit
    total_sales     FLOAT    NOT NULL,  -- total sales during the cash audit period
    FOREIGN KEY (business_id) REFERENCES business(id),
    FOREIGN KEY (user_id) REFERENCES user(id)
);

-- Table for sales (transactions)
CREATE TABLE sale
(
    id          INT AUTO_INCREMENT PRIMARY KEY,
    business_id INT NOT NULL,  -- linked to the business where the sale was made
    user_id     INT NOT NULL,  -- linked to user who processed the sale
    cash_audit_id INT NULL,  -- linked to the cash audit (opening and closing of cash)
    sale_date   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    total       FLOAT    NOT NULL,  -- total price for the sale
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (business_id) REFERENCES business(id),
    FOREIGN KEY (cash_audit_id) REFERENCES cash_audit(id)
);

-- Table for sale details (items sold within a sale)
CREATE TABLE sale_detail
(
    id          INT AUTO_INCREMENT PRIMARY KEY,
    sale_id     INT NOT NULL,  -- linked to sale
    article_id  INT NOT NULL,  -- linked to article sold
    quantity    INT NOT NULL,  -- quantity sold
    unit_price  FLOAT    NOT NULL,  -- price per item
    total_price FLOAT    NOT NULL,  -- total price for the item (quantity * unit_price)
    FOREIGN KEY (sale_id) REFERENCES sale(id),
    FOREIGN KEY (article_id) REFERENCES article(id)
);

-- INSERTION OF INITIAL DATA
INSERT INTO category (name, description) VALUES
('Abarrotes', 'Productos básicos y alimentos no perecederos'),
('Lácteos', 'Leche, queso, yogurt y otros productos lácteos'),
('Bebidas', 'Refrescos, agua, jugos y bebidas alcohólicas'),
('Limpieza', 'Productos para limpieza del hogar'),
('Botanas', 'Frituras, galletas, dulces y snacks');

INSERT INTO business (name, address, phone, email) VALUES
('Abarrotes Admin', 'Av. Revolución 123, Ciudad de México', '5512345678', 'contacto@abarrotes.com');

-- User: admin1
-- Password: Admin1#123
INSERT INTO user (business_id, username, password, full_name, role) VALUES
(1, 'admin1', '3e8a3cbb864893a81044550e3e98d8ee6d6b9499165029edee332b22ed1f9206', 'José Luis Sánchez', 'admin');

INSERT INTO article (business_id, category_id, description, code, barcode, price, cost, stock) VALUES
-- Categoría: Abarrotes
(1, 1, 'Tortilla 1kg', '1', '7501000123457', 25.50, 20.00, 100),
(1, 1, 'Frijol 1kg', '2', '7501000123458', 32.00, 26.00, 80),
(1, 1, 'Aceite 1L', '3', '7501000123459', 38.50, 31.00, 60),
(1, 1, 'Azúcar 1kg', '4', '7501000123460', 28.90, 23.00, 75),

-- Categoría: Lácteos
(1, 2, 'Leche entera 1L', '5', '7501000123461', 24.50, 19.50, 50),
(1, 2, 'Queso panela 400g', '6', '7501000123462', 45.00, 36.00, 30),
(1, 2, 'Yogurt natural 1L', '7', '7501000123463', 32.50, 26.00, 40),
(1, 2, 'Crema 500ml', '8', '7501000123464', 39.00, 31.20, 25),

-- Categoría: Bebidas
(1, 3, 'Refresco cola 2L', '9', '7501000123465', 29.90, 24.00, 120),
(1, 3, 'Agua mineral 1.5L', '10', '7501000123466', 18.50, 14.80, 150),
(1, 3, 'Jugo de naranja 1L', '11', '7501000123467', 26.00, 20.80, 45),
(1, 3, 'Cerveza lata 355ml', '12', '7501000123468', 22.00, 17.60, 200),

-- Categoría: Limpieza
(1, 4, 'Detergente 1kg', '13', '7501000123469', 42.50, 34.00, 60),
(1, 4, 'Cloro 1L', '14', '7501000123470', 19.90, 15.92, 70),
(1, 4, 'Jabón de baño', '15', '7501000123471', 16.50, 13.20, 100),
(1, 4, 'Papel higiénico 4 rollos', '16', '7501000123472', 35.90, 28.72, 80),

-- Categoría: Botanas
(1, 5, 'Papas fritas 150g', '17', '7501000123473', 28.50, 22.80, 65),
(1, 5, 'Galletas surtidas 500g', '18', '7501000123474', 32.00, 25.60, 50),
(1, 5, 'Chocolate 100g', '19', '7501000123475', 22.50, 18.00, 70),
(1, 5, 'Palomitas 100g', '20', '7501000123476', 18.90, 15.12, 85);