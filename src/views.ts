import type { Customer, Product, OrderItem, OrderView } from './interfaces';

import type { TableType } from "./interfaces";

// Generic function to compute paginated data and column widths
export const getTableView = (
  table: TableType,
  customers: Customer[],
  products: Product[],
  orderItems: OrderItem[],
  currentPage: number,
  rowsPerPage: number
) => {
  let data: any[] = [];
  let columnWidths: number[] = [];

  let sorted;
  if (table === "Customers") {
    sorted = [...customers].sort((a,b) => a.id - b.id);
    columnWidths = [
      Math.max(...customers.map(c => String(c.id).length), "ID".length ),
      Math.max(...customers.map(c => c.name.length), "Name".length ),
      Math.max(...customers.map(c => c.city.length), "City".length ),
      Math.max(...customers.map(c => c.country.length), "Country".length ),
    ];
  } else if (table === "Products") {
    sorted = [...products].sort((a,b) => a.id - b.id);
    columnWidths = [
      Math.max(...products.map(p => String(p.id).length), "ID".length ),
      Math.max(...products.map(p => p.name.length), "Name".length ),
      Math.max(...products.map(p => p.description.length), "Description".length ),
      Math.max(...products.map(p => p.manufacturer.length), "Manufacturer".length ),
      Math.max(...products.map(p => String(p.priceUSD).length), "Price USD".length ),
    ];
  } else if (table === "Orders") {
    sorted = [...orderItems].sort((a,b) => a.id - b.id);
    columnWidths = [
      Math.max(...orderItems.map(o => String(o.id).length), "Order ID".length ),
      Math.max(...orderItems.map(o => o.customer.length), "Customer".length ),
      Math.max(...orderItems.map(o => o.product.length), "Product".length ),
      Math.max(...orderItems.map(o => String(o.quantity).length), "Quantity".length ),
      Math.max(...orderItems.map(o => String(o.price).length), "Price USD".length ),
      Math.max(...orderItems.map(o => String(o.subtotal).length), "Subtotal USD".length ),
    ];
  }
  if( sorted ){
    data = sorted.slice((currentPage-1)*rowsPerPage, currentPage*rowsPerPage);
    //console.log( (currentPage-1)*rowsPerPage, currentPage*rowsPerPage, data.length );
    
    let first = (currentPage-1)*rowsPerPage;
    while( currentPage > 1 && data.length < rowsPerPage && first > 0 )
      data = sorted.slice(--first, currentPage*rowsPerPage);
  }

  return { paginatedData: data, columnWidths };
};

export const getMasterView = (
  orders: OrderView[],
  currentPage: number,
  rowsPerPage: number
) => {
  let data: any[] = [];
  let columnWidths: number[] = [];

  const sorted  = [...orders].sort((a,b) => a.id - b.id);
  columnWidths = [
    Math.max(...orders.map(c => String(c.id).length), "ID".length ),
    Math.max(...orders.map(c => c.customer.length), "Customer".length ),
    Math.max(...orders.map(c => String(c.products).length), "Products".length ),
    Math.max(...orders.map(c => c.amountUSD.length), "Amount USD  ".length ),
  ];

  if( sorted ){
    data = sorted.slice((currentPage-1)*rowsPerPage, currentPage*rowsPerPage);
    //console.log( (currentPage-1)*rowsPerPage, currentPage*rowsPerPage, data.length );
    
    let first = (currentPage-1)*rowsPerPage;
    while( currentPage > 1 && data.length < rowsPerPage && first > 0)
      data = sorted.slice(--first, currentPage*rowsPerPage);
  }

  return { paginatedData: data, columnWidths };
};
