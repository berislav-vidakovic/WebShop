import type { Dispatch, SetStateAction } from 'react';
import type { OrderView } from '../interfaces'
import { createClient } from 'graphql-ws';

interface OrdersAllVResponse {
  orders_all_v: {
    order_id: number;
    customer: string;
    products: number;
    amount_usd: number;
  }[];
}

export function useOrdersSubscription(
  setOrdersMaster: Dispatch<SetStateAction<OrderView[]>> ) {
  const wsClient = createClient({
    url: 'wss://hasura.barryonweb.com/v1/graphql',
    // connectionParams can be added later if needed
  });

  const unsubscribe = wsClient.subscribe(
    {
      query: `
        subscription GetOrdersAll {
          orders_all_v {
            order_id
            customer
            products
            amount_usd
          }
        }
      `,
    },
    {
      next: (data) => {
        if (!data.data) return;

        const payload = data as unknown as { data: OrdersAllVResponse };

        const mapped: OrderView[] = payload.data.orders_all_v.map((o) => ({
          id: o.order_id,
          customer: o.customer,
          products: o.products,
          amountUSD: o.amount_usd.toFixed(2),
        }));
        setOrdersMaster(mapped);
      },
      error: (err) => console.error('Subscription error:', err),
      complete: () => console.log('Subscription completed'),
    }
  );

  return () => unsubscribe();
}
