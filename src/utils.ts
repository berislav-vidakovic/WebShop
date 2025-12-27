import type { OrderItem, OrderDraftItem } from './interfaces'

export function numToString(n: number){
  return n.toLocaleString('en-US', { 
              minimumFractionDigits: 2, 
              maximumFractionDigits: 2 
            });
}

export function strToNum(s: string) {
     return Number(s.replace(/,/g, ''));
}

export function mapOrderItems(items: OrderItem[]){
  
}
