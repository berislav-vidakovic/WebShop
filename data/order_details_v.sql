DROP VIEW IF EXISTS order_details_v; 
CREATE VIEW order_details_v AS
SELECT o.id AS order_id, 
        c.name AS customer, 
        p.name AS product, 
        oi.quantity, 
        o.order_date,
        p.price_usd
FROM orders o
JOIN customers c ON o.customer_id=c.id
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON p.id=oi.product_id
ORDER BY o.id;

