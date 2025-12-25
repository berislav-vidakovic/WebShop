DROP VIEW IF EXISTS orders_all_v; 
CREATE VIEW orders_all_v AS
  WITH cteOrdersAll AS (
    SELECT o.id AS order_id, 
           c.name AS customer, 
           p.name AS product, 
           oi.quantity, 
           o.order_date,
           p.price_usd
      FROM orders o
      JOIN customers c ON o.customer_id=c.id
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON p.id=oi.product_id ORDER BY o.id
  )
  SELECT order_id, customer, SUM(quantity) AS products, SUM(price_usd) AS amount_usd
  FROM cteOrdersAll
  GROUP BY order_id, customer
  ORDER BY order_id;
