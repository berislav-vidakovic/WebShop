import { getHasuraQueryUrl } from "../utils";


//generic function
export async function sendGraphQLquery(body: string){
  console.log("Send GraphQL query to ...", getHasuraQueryUrl() )
  const res = await fetch( getHasuraQueryUrl(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body
  });  
  const json = await res.json();
  return json;
}
