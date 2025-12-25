import type { Customer, Product, OrderView } from '../interfaces'

const hasuraURL = "https://hasura.barryonweb.com/v1/graphql";

export const fetchCustomers = async (): Promise<Customer[]> => {
  try {
    const body : string = JSON.stringify({
        query: `
          query GetCustomers {
            customers {
              id
              name
              city
              country
            }
          }
        `});
    const json = await sendGraphQLquery(body);

    return json.data.customers as Customer[];
  } 
  catch (error) {
    console.error("Error fetching GraphQL:", error);
    return [];
  }
}


export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const body =  JSON.stringify({
        query: `
          query GetProducts {
            products {
              id
              name
              description
              manufacturer
              price_usd
            }
          }
        `});

    const json = await sendGraphQLquery(body);

    const data: Product[] = json.data.products.map((p: any) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      manufacturer: p.manufacturer,
      priceUSD: p.price_usd.toFixed(2)
    }));

    return data;
  } 
  catch (error) {
    console.error("Error fetching GraphQL:", error);
    return [];
  }
}

export const fetchOrdersAll = async (): Promise<OrderView[]> => {
  try {
    const body : string = JSON.stringify({
        query: `
          query GetOrdersAll {
            orders_all_v {
              order_id
              customer
              products
              amount_usd
            }
          }
        `});
    const json = await sendGraphQLquery(body);

    const data: OrderView[] = json.data.orders_all_v.map((o: any) => ({
      id: o.order_id,
      customer: o.customer,
      products: o.products,
      amountUSD: o.amount_usd.toFixed(2)
    }));

    return data;
  } 
  catch (error) {
    console.error("Error fetching GraphQL:", error);
    return [];
  }
}

//generic function
async function sendGraphQLquery(body: string){
  const res = await fetch( hasuraURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body
  });  
  const json = await res.json();
  return json;
}
