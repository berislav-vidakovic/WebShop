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