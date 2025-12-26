export interface Customer{
  id: number,
  name: string,
  city: string,
  country: string
}

export interface Product{
  id: number,
  name: string,
  description: string,
  manufacturer: string,
  priceUSD: string
}

export interface OrderView{
  id: number,
  customer: string,
  products: number,
  amountUSD: string
}

export interface OrderItem{
  id: number,
  customer: string,
  product: string,
  quantity: number
}

export type TableType = "Customers" | "Products" | "Orders";

export interface OrderDraftItem {
  productId: number;
  productName: string;
  priceUSD: number;
  quantity: number;
};
