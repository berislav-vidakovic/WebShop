import type { Customer, Product } from '../interfaces'

const hasuraURL = "https://hasura.barryonweb.com/v1/graphql";

export const fetchCustomers = async (): Promise<Customer[]> => {
  try {
    const response = await fetch(hasuraURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // If you add admin secret later:
        // "x-hasura-admin-secret": "your_secret_here"
      },
      body: JSON.stringify({
        query: `
          query GetCustomers {
            customers {
              id
              name
              city
              country
            }
          }
        `
      })
    });

    const json = await response.json();
    return json.data.customers as Customer[];
  } 
  catch (error) {
    console.error("Error fetching GraphQL:", error);
    return [];
  }
};

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch(hasuraURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // If you add admin secret later:
        // "x-hasura-admin-secret": "your_secret_here"
      },
      body: JSON.stringify({
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
        `
      })
    });

    const json = await response.json();
    return json.data.products as Product[];
  } 
  catch (error) {
    console.error("Error fetching GraphQL:", error);
    return [];
  }
};

