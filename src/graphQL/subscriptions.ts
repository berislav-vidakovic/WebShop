import type { Dispatch, SetStateAction } from 'react';
import type { OrderView } from '../interfaces'
import { createClient } from 'graphql-ws';
import { getHasuraSubscriptionUrl, numToString } from '../utils';

/*
PostgreSQL view definition:
WITH cteordersall AS (
  SELECT o.id AS order_id,
    c.name AS customer,
    p.name AS product,
    oi.quantity,
    o.order_date,
    p.price_usd
    FROM orders o
      JOIN customers c ON o.customer_id = c.id
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON p.id = oi.product_id
  ORDER BY o.id
)
SELECT order_id,
    customer,
    sum(quantity) AS products,
    sum(price_usd) AS amount_usd
   FROM cteordersall
GROUP BY order_id, customer
ORDER BY order_id;

Result set:
----------+-------------+----------+------------
 order_id |  customer   | products | amount_usd
----------+-------------+----------+------------
        1 | Hexagon SIG |        3 |    2398.99
        2 | Hexagon MI  |        4 |    1948.00
*/
interface OrdersAllVResponse {
  orders: {
    id: number;                  
    customer: {
      name: string;
    };
    order_items: {
      quantity: number;
      product: {
        price_usd: number;
      };
    }[];
  }[];
}

export function useOrdersSubscription(
  setOrdersMaster: Dispatch<SetStateAction<OrderView[]>> ) {
  const wsClient = createClient({
    url: getHasuraSubscriptionUrl(),
    // connectionParams can be added later if needed
  });

  const unsubscribe = wsClient.subscribe(
    {
      query: `
        subscription GetOrdersAll {
          orders {
            id
            customer {
              name
            }
            order_items {
              quantity
              product {
                price_usd
              }
            }
          }
        }
      `,
    },
    {
      next: (data) => {
        if (!data.data) return;

        const payload = data as unknown as { data: OrdersAllVResponse };

        const mapped: OrderView[] = payload.data.orders.map((o) => {
          const totalProducts = o.order_items.reduce((sum: number, item: any) => sum + item.quantity, 0);
          const totalAmount = o.order_items.reduce((sum: number, item: any) => sum + item.quantity * item.product.price_usd, 0);

          return {
            id: o.id,
            customer: o.customer.name,
            products: totalProducts,
            amountUSD: numToString(totalAmount)
          };
        });
        
        setOrdersMaster(mapped);
      },
      error: (err) => console.error('Subscription error:', err),
      complete: () => console.log('Subscription completed'),
    }
  );

  return () => unsubscribe();
}
