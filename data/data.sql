TRUNCATE TABLE customers, products RESTART IDENTITY CASCADE;

INSERT INTO products (name, description, manufacturer, price_usd)
VALUES
('Laptop Pro 15', '15-inch performance laptop with Intel Core i7, 16GB RAM, 512GB SSD', 'Dell', 1499.99),
('Desktop PC Tower', 'Mid-range desktop PC with AMD Ryzen 5, 32GB RAM, 1TB SSD', 'HP', 1199.00),
('MacBook Pro 14', '14-inch laptop with Apple M2 chip, 16GB unified memory, 512GB SSD', 'Apple', 1999.00),
('MacBook Air', 'Lightweight 13-inch laptop with Apple M1 chip, 8GB memory, 256GB SSD', 'Apple', 999.00),
('iPhone 15', 'Smartphone with 6.1-inch OLED display, A16 Bionic chip, 128GB storage', 'Apple', 899.00),
('Android Smartphone X', 'Android phone with 6.5-inch display, Snapdragon processor, 128GB storage', 'Samsung', 749.00);

INSERT INTO customers (name, city, country)
VALUES
('Hexagon SIG', 'Munich', 'Germany'),
('Hexagon MI', 'Waldburg', 'Germany'),
('Musgrave', 'Dublin', 'Ireland'),
('Uber', 'San Francisco', 'USA'),
('Unisys', 'London', 'UK'),
('Infosistem', 'Zagreb', 'Croatia'),
('Koncar D&ST', 'Zagreb', 'Croatia');

INSERT INTO orders (customer_id, order_date)
VALUES
(1, '2025-01-05'),
(2, '2025-01-06'),
(3, '2025-01-07'),
(4, '2025-01-08'),
(5, '2025-01-09'),
(6, '2025-01-10'),
(7, '2025-01-11'),
(1, '2025-01-12'),
(3, '2025-01-13'),
(5, '2025-01-14');

INSERT INTO order_items (order_id, product_id, quantity)
VALUES
-- Order 1
(1, 1, 2),
(1, 5, 1),

-- Order 2
(2, 2, 1),
(2, 6, 3),

-- Order 3
(3, 3, 1),
(3, 5, 2),

-- Order 4
(4, 4, 2),
(4, 6, 1),

-- Order 5
(5, 1, 1),
(5, 3, 1),
(5, 5, 1),

-- Order 6
(6, 2, 2),
(6, 4, 1),

-- Order 7
(7, 6, 2),
(7, 5, 1),

-- Order 8
(8, 1, 1),
(8, 2, 1),
(8, 3, 1),

-- Order 9
(9, 4, 2),
(9, 6, 1),

-- Order 10
(10, 1, 1),
(10, 2, 1),
(10, 3, 1),
(10, 5, 2);
