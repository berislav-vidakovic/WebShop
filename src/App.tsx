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

        {/* Pagination */}
        <div>
          <a href="#">First</a> &nbsp;
          <a href="#">Previous</a> &nbsp;
          <a href="#">Next</a> &nbsp;
          <a href="#">Last</a>
        </div>

      {currentTable === 'Customers' && (
        <div className="table-container">
          <table className="table-def">
            <thead>
              <tr>
                <th className="cell-center">ID</th>
                <th>Name</th>
                <th>City</th>
                <th>Country</th>
              </tr>
            </thead>
            <tbody>
              {customers.sort((a,b)=>a.id-b.id).map(c => (
                <tr className={ c.id % 2 != 0 ? "odd-row": ""}  key={c.id}>
                  <td className="cell-center">{c.id}</td>
                  <td>{c.name}</td>
                  <td>{c.city}</td>
                  <td>{c.country}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {currentTable === 'Products' && (
        <div className="table-container">
          <table className="table-def">
            <thead>
              <tr>
                <th className="cell-center">ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Manufacturer</th>
                <th className="cell-right">Price USD</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} className={p.id % 2 !== 0 ? "odd-row" : ""}>
                  <td className="cell-center">{p.id}</td>
                  <td>{p.name}</td>
                  <td>{p.description}</td>
                  <td>{p.manufacturer}</td>
                  <td className="cell-right">{p.priceUSD}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}


       {currentTable === 'Orders' && (
  <div className="table-container">
    <table className="table-def">
      <thead>
        <tr>
          <th className="cell-center">Order ID</th>
          <th>Customer</th>
          <th className="cell-center">Product</th>
          <th className="cell-center">Quantity</th>
        </tr>
      </thead>
      <tbody>
        {orderItems.map(oi => (
          <tr key={oi.id + oi.product} className={oi.id % 2 !== 0 ? "odd-row" : ""}>
            <td className="cell-center">{oi.id}</td>
            <td>{oi.customer}</td>
            <td className="cell-center">{oi.product}</td>
            <td className="cell-center">{oi.quantity}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}



      </div>
      <div>
        <h2>Total Orders USD: {ordersMaster
                        .map(o => Number(o.amountUSD.replace(/,/g, '')))
                        .reduce((curr,sum) => Number(sum) + Number(curr), 0)
                        .toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) 
                        }
        </h2>
        <hr />        

        <label>
          Last update: Monday, December the 22nd 2025
        </label>
      </div>

      {/* Order overview table */}
<div className="table-container">
  <table className="table-def">
    <thead>
      <tr>
        <th className="cell-center">ID</th>
        <th>Customer</th>
        <th className="cell-center">Products</th>
        <th className="cell-right">Amount USD</th>
      </tr>
    </thead>
    <tbody>
      {ordersMaster.map(o => (
        <tr key={o.id} className={o.id % 2 !== 0 ? "odd-row" : ""}>
          <td className="cell-center">{o.id}</td>
          <td>{o.customer}</td>
          <td className="cell-center">{o.products}</td>
          <td className="cell-right">{o.amountUSD}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

    </div>
  )
}

export default App
