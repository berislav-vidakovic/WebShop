import type { Customer, Product, OrderItem } from './interfaces';

export type TableType = "Customers" | "Products" | "Orders";

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

  if (table === "Customers") {
    const sorted = [...customers].sort((a,b) => a.id - b.id);
    data = sorted.slice((currentPage-1)*rowsPerPage, currentPage*rowsPerPage);
    columnWidths = [
      Math.max(...customers.map(c => String(c.id).length)),
      Math.max(...customers.map(c => c.name.length)),
      Math.max(...customers.map(c => c.city.length)),
      Math.max(...customers.map(c => c.country.length)),
    ];
  } else if (table === "Products") {
    const sorted = [...products].sort((a,b) => a.id - b.id);
    data = sorted.slice((currentPage-1)*rowsPerPage, currentPage*rowsPerPage);
    columnWidths = [
      Math.max(...products.map(p => String(p.id).length)),
      Math.max(...products.map(p => p.name.length)),
      Math.max(...products.map(p => p.description.length)),
      Math.max(...products.map(p => p.manufacturer.length)),
      Math.max(...products.map(p => String(p.priceUSD).length)),
    ];
  } else if (table === "Orders") {
    const sorted = [...orderItems].sort((a,b) => a.id - b.id);
    data = sorted.slice((currentPage-1)*rowsPerPage, currentPage*rowsPerPage);
    columnWidths = [
      Math.max(...orderItems.map(o => String(o.id).length)),
      Math.max(...orderItems.map(o => o.customer.length)),
      Math.max(...orderItems.map(o => o.product.length)),
      Math.max(...orderItems.map(o => String(o.quantity).length)),
    ];
  }

  return { paginatedData: data, columnWidths };
};
