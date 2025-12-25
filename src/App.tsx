import { useState, useEffect } from 'react'
import './App.css'
import { fetchCustomers, fetchOrdersAll, fetchProducts } from './graphQL/queries'
import type { Customer, OrderView, Product } from './interfaces'
import './style.css'


function App() {
  const [currentTable, setCurrentTable] = useState<"Customers" | "Products">("Customers");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [ordersMaster, setOrdersMaster] = useState<OrderView[]>([]);

  useEffect(() => {
    fetchCustomers().then(setCustomers);
    fetchProducts().then(setProducts);
    fetchOrdersAll().then(setOrdersMaster);
  }, []) 

  const format4columns = ['80px','1fr','1fr','1fr'];
  
  
  const currentColumns = () => {
    return currentTable === 'Customers'
    ? format4columns
    : ['80px','200px','1fr','150px','100px'];  // 5 columns for products
  }

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
              value="customers"
              checked={currentTable === 'Customers'}
              onChange={() => setCurrentTable('Customers')}
            />
            Customers
          </label>

          <label>
            <input
              type="radio"
              value="products"
              checked={currentTable === 'Products'}
              onChange={() => setCurrentTable('Products')}
            />
            Products
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
               style={{ gridTemplateColumns: currentColumns().join(' ') }}
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
               style={{ gridTemplateColumns: currentColumns().join(' ') }}
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
              <div className="grid-row" key={o.id}>
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
