import { useState, useEffect } from 'react'
import './App.css'
import { fetchCustomers,  fetchProducts, fetchOrderItems } from './graphQL/queries'
import type { Customer, OrderView, Product, OrderItem } from './interfaces'
import './style.css'
import { useOrdersSubscription } from './graphQL/subscriptions';
import { Pagination  } from './Pagination'
import { getTableView } from './views';
import type { TableType } from './views';

function App() {
  const [currentTable, setCurrentTable] = useState<TableType>("Customers");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [ordersMaster, setOrdersMaster] = useState<OrderView[]>([]);

  const [totalPages, setTotalPages] = useState<number>(0); 
  const [currentPage, setCurrentPage] = useState(1);

  const [paginatedCustomers, setPaginatedCustomers] = useState<Customer[]>([]);
  const [columnWidthsCustomers, setColumnWidthsCustomers] = useState<number[]>([]);

  const [paginatedProducts, setPaginatedProducts] = useState<Product[]>([]);
  const [columnWidthsProducts, setColumnWidthsProducts] = useState<number[]>([]);

  const [paginatedOrders, setPaginatedOrders] = useState<OrderItem[]>([]);
  const [columnWidthsOrders, setColumnWidthsOrders] = useState<number[]>([]);
  
  const rowsPerPage = 5;

  useEffect(() => {
    fetchCustomers().then(setCustomers);
    fetchProducts().then(setProducts);
    fetchOrderItems().then(setOrderItems);
    initializeView("Customers");
  }, []);

  useEffect(() => {
    useOrdersSubscription(setOrdersMaster);
  }, []);

  useEffect(() => {
    initializeView(currentTable);
  }, [currentTable, currentPage, customers, products, orderItems]);


  const goFirst = () => setCurrentPage(1);
  const goPrev = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const goNext = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const goLast = () => setCurrentPage(totalPages);

  // input - customers
  // output - paginatedCustomers, columnWidthCustomers
//    const [customers, setCustomers] = useState<Customer[]>([]);
  //const [products, setProducts] = useState<Product[]>([]);
  //const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  const setPageCount = ( table: TableType) =>{
    let len = customers.length;
    if( table === "Products")
      len = products.length;
    else if( table === "Orders" )
      len = orderItems.length;

    setTotalPages(Math.ceil(len / rowsPerPage));
  }

  const initializeView = (table: TableType) => {
    setCurrentTable(table);
    setPageCount(table);    
    //setCurrentPage(1); 

    // compute paginated data
    const { paginatedData, columnWidths } = getTableView(
      table,
      customers,
      products,
      orderItems,
      currentPage,
      rowsPerPage
    );

    if (table === "Products") {
      setPaginatedProducts(paginatedData);
      setColumnWidthsProducts(columnWidths);
    } 
    else if (table === "Orders") {
      setPaginatedOrders(paginatedData);
      setColumnWidthsOrders(columnWidths);
    } 
    else { // Customers
      setPaginatedCustomers(paginatedData);
      setColumnWidthsCustomers(columnWidths);
    }
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
              value="Customers"
              checked={currentTable === 'Customers'}
              onChange={() => {
                setCurrentPage(1);
                initializeView('Customers');
              }
              }
            />
            Customers
          </label>

          <label>
            <input
              type="radio"
              value="Products"
              checked={currentTable === 'Products'}
              onChange={() => {setCurrentPage(1); initializeView('Products');}}
            />
            Products
          </label>

          
          <label>
            <input
              type="radio"
              value="Orders"
              checked={currentTable === 'Orders'}
                
              onChange={() => { setCurrentPage(1); initializeView('Orders');}}
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
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          goFirst={goFirst}
          goPrev={goPrev}
          goNext={goNext}
          goLast={goLast}
        />

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
              {              
              paginatedCustomers.map(c => (
                <tr className={ c.id % 2 != 0 ? "odd-row": ""}  key={c.id}>
                  <td className="cell-center" style={{ width: `${columnWidthsCustomers[0]}ch` }}>{c.id}</td>
                  <td style={{ width: `${columnWidthsCustomers[1]}ch` }}>{c.name}</td>
                  <td style={{ width: `${columnWidthsCustomers[2]}ch` }}>{c.city}</td>
                  <td style={{ width: `${columnWidthsCustomers[3]}ch` }}>{c.country}</td>
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
              {paginatedProducts.map(p => (
                <tr key={p.id} className={p.id % 2 !== 0 ? "odd-row" : ""}>
                  <td className="cell-center" style={{ width: `${columnWidthsProducts[0]}ch` }}>{p.id}</td>
                  <td style={{ width: `${columnWidthsProducts[1]}ch` }}>{p.name}</td>
                  <td style={{ width: `${columnWidthsProducts[2]}ch` }}>{p.description}</td>
                  <td style={{ width: `${columnWidthsProducts[3]}ch` }}>{p.manufacturer}</td>
                  <td className="cell-right" style={{ width: `${columnWidthsProducts[4]}ch` }}>{p.priceUSD}</td>
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
                {paginatedOrders.map(oi => (
                  <tr key={oi.id + oi.product} className={oi.id % 2 !== 0 ? "odd-row" : ""}>
                    <td className="cell-center" style={{ width: `${columnWidthsOrders[0]}ch` }}>{oi.id}</td>
                    <td style={{ width: `${columnWidthsOrders[1]}ch` }}>{oi.customer}</td>
                    <td className="cell-center" style={{ width: `${columnWidthsOrders[2]}ch` }}>{oi.product}</td>
                    <td className="cell-center" style={{ width: `${columnWidthsOrders[3]}ch` }}>{oi.quantity}</td>
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
      <div className="table-container master">
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
              <tr key={o.id} className={o.id % 2 !== 0 ? "odd-row-master" : ""}>
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
