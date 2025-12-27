import { sendGraphQLquery } from "./queries";
import type { OrderDraftItem } from '../interfaces'

// Using single GraphQL mutation with nested inserts
export async function placeNewOrderMutation(customerId: number, items: OrderDraftItem[])
{
  if( !items.length ) return;
  // Construct the GraphQL mutation
  const today = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"

  const mutation = `
    mutation InsertOrder($customerId: Int!, $orderItems: [order_items_insert_input!]!, $orderDate: date!) {
      insert_orders_one(object: {
        customer_id: $customerId,
        order_date: $orderDate,
        order_items: { data: $orderItems }
      }) {
        id
        order_date
      }
    }
  `;

  // Map items to GraphQL input format
  const orderItemsInput = items.map(item => ({
    product_id: item.productId,
    quantity: item.quantity
  }));

  const body = JSON.stringify({
    query: mutation,
    variables: {
      customerId,
      orderItems: orderItemsInput,
      orderDate: today
    }
  });

  try {
    const result = await sendGraphQLquery(body);
    console.log("Order created:", result);
    return result;
  } 
  catch (error) {
    console.error("Error executing  GraphQL mutation:", error);
    return [];
  }
}

export async function updateOrderMutation( orderId: number, customerId: number, items: OrderDraftItem[]){
    if( !items.length ) return;
    const mutation = `
    mutation UpdateOrder(
      $orderId: Int!
      $customerId: Int!
      $orderItems: [order_items_insert_input!]!
    ) {
      update_orders_by_pk(
        pk_columns: { id: $orderId }
        _set: { customer_id: $customerId }
      ) {
        id
      }

      delete_order_items(
        where: { order_id: { _eq: $orderId } }
      ) {
        affected_rows
      }

      insert_order_items(
        objects: $orderItems
      ) {
        affected_rows
      }
    }
  `;

  const orderItemsInput = items.map(item => ({
    order_id: orderId,
    product_id: item.productId,
    quantity: item.quantity
  }));

  const body = JSON.stringify({
    query: mutation,
    variables: {
      orderId,
      customerId,
      orderItems: orderItemsInput
    }
  });

  try {
    const result = await sendGraphQLquery(body);
    console.log("Order updated:", result);
    return result;
  } 
  catch (error) {
    console.error("Error executing  GraphQL update mutation:", error);
    return [];
  }

}
