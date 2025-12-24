export const fetchCustomers = async () => {
  try {
    const response = await fetch("https://hasura.barryonweb.com/v1/graphql", {
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

    const data = await response.json();
    console.log("GraphQL response:", data);
  } 
  catch (error) {
    console.error("Error fetching GraphQL:", error);
  }
};

