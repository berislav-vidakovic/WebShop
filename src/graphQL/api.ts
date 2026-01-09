const hasuraURL = "https://hasura-dev.barryonweb.com/v1/graphql";

//generic function
export async function sendGraphQLquery(body: string){
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
