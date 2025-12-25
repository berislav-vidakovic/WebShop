import { useState, useEffect } from 'react'
import './App.css'
import { fetchCustomers, fetchProducts } from './graphQL/queries'
import type { Customer, Product } from './interfaces'
import './style.css'


function App() {
  const [currentTable, setCurrentTable] = useState<"Customers" | "Products">("Customers");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchCustomers().then(setCustomers);
    fetchProducts().then(setProducts);
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
            <div className="grid-header">ID</div>
            <div className="grid-header">Name</div>
            <div className="grid-header">City</div>
            <div className="grid-header">Country</div>

            {customers.map(c => (
              <div className="grid-row" key={c.id}>
                <div>{c.id}</div>
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
            <div className="grid-header">ID</div>
            <div className="grid-header">Name</div>
            <div className="grid-header">Description</div>
            <div className="grid-header">Manufacturer</div>
            <div className="grid-header">Price USD</div>

            {products.map(p => (
              <div className="grid-row" key={p.id}>
                <div>{p.id}</div>
                <div>{p.name}</div>
                <div>{p.description}</div>
                <div>{p.manufacturer}</div>
                <div>{p.priceUSD}</div>
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

        {/* Add New table - Grid */}
        {/* Order overview table */}
        <div className="grid-container">
<div className="grid grid-order">
  <div className="grid-header">ID</div>
  <div className="grid-header">Customer</div>
  <div className="grid-header">Products</div>
  <div className="grid-header">Amount USD</div>

  <div className="grid-row">
    <div>1</div>
    <div>Acme Corp</div>
    <div>Keyboard, Mouse</div>
    <div>120.50</div>
  </div>

  <div className="grid-row">
    <div>2</div>
    <div>Globex</div>
    <div>Monitor</div>
    <div>299.99</div>
  </div>

  <div className="grid-row">
    <div>3</div>
    <div>Initech</div>
    <div>Laptop, Dock</div>
    <div>1,450.00</div>
  </div>
</div>
</div>

        
      </div>
    </div>
  )
}

export default App
