import { useState } from "react";
import type { Customer, Product, OrderDraftItem} from "../interfaces";


export const PlaceOrderDialog = ({
  customers,
  products,
  onCancel,
  onComplete
}: {
  customers: Customer[];
  products: Product[];
  onCancel: () => void;
  onComplete: (customerId: number, items: OrderDraftItem[]) => void;
}) => {
  const [customerId, setCustomerId] = useState<number | null>(null);
  const [productId, setProductId] = useState<number | null>(null);
  const [items, setItems] = useState<OrderDraftItem[]>([]);

  const addItem = () => {
    if (!productId) return;

    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    
    const existing = items.some(p=>p.productId === productId );
    if( existing )
      setItems(prev=>prev.map(item=>
        item.productId === productId
        ? { ...item, quantity: item.quantity+1 }
        : item )
      );    
    else
      setItems(prev => [
        ...prev,
        {
          productId: product.id,
          productName: product.name,
          priceUSD: Number(product.priceUSD.replace(/,/g, '')),
          quantity: 1
        }
      ]);
  };

  const updateQty = (index: number, qty: number) => {
    setItems(prev =>
      prev.map((it, i) =>
        i === index ? { ...it, quantity: qty } : it
      )
    );
  };

  const removeItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const total = items.reduce(
    (sum, i) => sum + i.quantity * i.priceUSD,
    0
  );

  return (
  <div className="modal-backdrop">
    <div className="modal">

    <h3 className="modal-title">Place new Order</h3>

    {/* Customer */}
    <div className="form-group">
      <label>Customer</label>
      <select
        value={customerId ?? ""}
        onChange={e => setCustomerId(Number(e.target.value))}
      >
        <option value="" disabled>Select customer</option>
        {customers.map(c => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>
    </div>

    {/* Product */}
    <div className="form-group">
      <label>Product</label>
      <div className="inline-row">
        <select
          value={productId ?? ""}
          onChange={e => setProductId(Number(e.target.value))}
        >
          <option value="" disabled>Select product</option>
          {products.map(p => (
            <option key={p.id} value={p.id}>
              {p.name} (${p.priceUSD})
            </option>
          ))}
        </select>

        <button className="secondary" onClick={addItem}>
          Add
        </button>
      </div>
    </div>

    {/* Items */}
    {items.length > 0 && (
      <div className="draft-items">
        {items.map((it, i) => (
          <div key={i} className="draft-item">
            <span className="item-name">{it.productName}</span>

            <input
              type="number"
              min={1}
              value={it.quantity}
              onChange={e => updateQty(i, Number(e.target.value))}
            />

            <span className="item-subtotal">
              ${(it.quantity * it.priceUSD).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>

            <button className="icon" onClick={() => removeItem(i)}>✕</button>
          </div>
        ))}
      </div>
    )}

    {/* Total */}
    <div className="total">
      Amount Total 
      <span>${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }</span>
    </div>

    {/* Actions */}
    <div className="dialog-actions">
      <button className="secondary" onClick={onCancel}>Cancel</button>
      <button
        disabled={!customerId || items.length === 0}
        onClick={() => onComplete(customerId!, items)}
      >
        Complete Order
      </button>
    </div>

  </div>
</div>

  );
};
