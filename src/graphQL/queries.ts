import type { Customer, Product, OrderItem } from '../interfaces'

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

export const fetchOrderItems = async (): Promise<OrderItem[]> => {
  try {
    const body : string = JSON.stringify({
        query: `
          query GetOrderItems {
            order_details_v {
              order_id
              customer
              product
              quantity
            }
          }
        `});
    const json = await sendGraphQLquery(body);


    const data: OrderItem[] = json.data.order_details_v.map((od: any) => ({
      id: od.order_id,
      customer: od.customer,
      product: od.product,
      quantity: od.quantity
    }));

    return data;


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
      priceUSD: p.price_usd.toLocaleString('en-US', { 
              minimumFractionDigits: 2, 
              maximumFractionDigits: 2 
            })
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
