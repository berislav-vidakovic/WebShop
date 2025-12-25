import { useState, useEffect } from 'react'
import './App.css'
import { fetchCustomers,  fetchProducts, fetchOrderItems } from './graphQL/queries'
import type { Customer, OrderView, Product, OrderItem } from './interfaces'
import './style.css'
import { useOrdersSubscription } from './graphQL/subscriptions';

function App() {
  const [currentTable, setCurrentTable] = useState<"Customers" | "Products" | "Orders">("Customers");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [ordersMaster, setOrdersMaster] = useState<OrderView[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  useEffect(() => {
    fetchCustomers().then(setCustomers);
    fetchProducts().then(setProducts);
    fetchOrderItems().then(setOrderItems);
  }, []) 

  const format4columns = ['80px','1fr','1fr','1fr'];  
  
  const currentColumns = () => {
    const formats: Map<string, string[]> = new Map([
      ["Customers", format4columns],                   
      ["Products", ['80px','200px','1fr','150px','100px']], 
      ["Orders", ['100px','1fr','1fr','0.5fr']]       
    ]);

    return formats.get(currentTable);
  }

  useEffect(() => {
    useOrdersSubscription(setOrdersMaster);
  }, [])

 return (
    <div className="app">
      <div>
        <h2>{currentTable}</h2>
        <hr />

        {/* Radio buttons */}
        <div className="table-selector">
          <label>
            <input
              type="radio"
              value="Customers"
              checked={currentTable === 'Customers'}
              onChange={() => setCurrentTable('Customers')}
            />
            Customers
          </label>

          <label>
            <input
              type="radio"
              value="Products"
              checked={currentTable === 'Products'}
              onChange={() => setCurrentTable('Products')}
            />
            Products
          </label>

          
          <label>
            <input
              type="radio"
              value="Orders"
              checked={currentTable === 'Orders'}
              onChange={() => setCurrentTable('Orders')}
            />
            Order Items
          </label>
        </div>

        {/* Action buttons */}
        <div className="actions">
          <button>Add</button>
          <button>Update</button>
          <button>Delete</button>
        </div>

        {/* Grid */}
        {currentTable === 'Customers' && (
          <div className="grid-container">
          <div className="grid"
               style={{ gridTemplateColumns: currentColumns()!.join(' ') }}
          >
            <div className="grid-header cell-center">ID</div>
            <div className="grid-header">Name</div>
            <div className="grid-header">City</div>
            <div className="grid-header">Country</div>

            {customers.map(c => (
              <div className="grid-row" key={c.id}>
                <div className="cell-center">{c.id}</div>
                <div>{c.name}</div>
                <div>{c.city}</div>
                <div>{c.country}</div>
              </div>
            ))}
          </div>  
          </div>      
        )}

        {currentTable === 'Products' && (
          <div className="grid"
               style={{ gridTemplateColumns: currentColumns()!.join(' ') }}
          >
            <div className="grid-header cell-center">ID</div>
            <div className="grid-header">Name</div>
            <div className="grid-header">Description</div>
            <div className="grid-header">Manufacturer</div>
            <div className="grid-header cell-right">Price USD</div>

            {products.map(p => (
              <div className="grid-row" key={p.id}>
                <div className="cell-center">{p.id}</div>
                <div>{p.name}</div>
                <div>{p.description}</div>
                <div>{p.manufacturer}</div>
                <div className="cell-right">{p.priceUSD}</div>
              </div>
            ))}
          </div>        
        )}

        {currentTable === 'Orders' && (
          <div className="grid-container">
          <div className="grid"
               style={{ gridTemplateColumns: currentColumns()!.join(' ') }}
          >
            <div className="grid-header cell-center">Order ID</div>
            <div className="grid-header">Customer</div>
            <div className="grid-header">Product</div>
            <div className="grid-header cell-center">Quantity</div>

            {orderItems.map(oi => (
              <div className="grid-row" key={oi.id + oi.product}>
                <div className="cell-center">{oi.id}</div>
                <div>{oi.customer}</div>
                <div>{oi.product}</div>
                <div className="cell-center">{oi.quantity}</div>
              </div>
            ))}
          </div>  
          </div>      
        )}


      </div>
      <div>
        <h2>Order overview</h2>
        <hr />        

        <label>
          Last update: Monday, December the 22nd 2025
        </label>

        {/* Order overview table */}
        <div className="grid-container">
          <div className="grid grid-order">
            <div className="grid-header cell-center">ID</div>
            <div className="grid-header">Customer</div>
            <div className="grid-header cell-center">Products</div>
            <div className="grid-header cell-right">Amount USD</div>

            {ordersMaster.map(o => (
              <div 
                className= "grid-row"
                key={o.id}
              >
                <div className="cell-center">{o.id}</div>
                <div>{o.customer}</div>
                <div className="cell-center">{o.products}</div>
                <div className="cell-right">{o.amountUSD}</div>
              </div>
            ))}
          </div>
        </div>

        
      </div>
    </div>
  )
}

export default App
