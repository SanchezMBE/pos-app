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
    cash_audit_id INT NOT NULL,  -- linked to the cash audit (opening and closing of cash)
    sale_date   DATETIME NOT NULL,
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
