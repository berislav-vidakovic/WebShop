import { useState, useEffect } from 'react'
import './App.css'
import { fetchCustomers,  fetchProducts, fetchOrderItems } from './graphQL/queries'
import type { Customer, OrderView, Product, OrderItem } from './interfaces'
import './style.css'
import { useOrdersSubscription } from './graphQL/subscriptions';
import { Pagination  } from './Pagination'
import { getTableView } from './views';
import type { TableType } from './interfaces';
import { Customers } from './tables/Customers'
import { Products } from './tables/Products'
import { OrderItems } from './tables/Orders'
import { Selector } from './tables/Selector'

function App() {
  const [currentTable, setCurrentTable] = useState<TableType>("Customers");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [ordersMaster, setOrdersMaster] = useState<OrderView[]>([]);

  const [totalPages, setTotalPages] = useState<number>(0); 
  const [currentPage, setCurrentPage] = useState<number>(1);

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
        <Selector        
          currentTable={currentTable}
          setCurrentPage={setCurrentPage}
          initializeView={initializeView}
        />

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

      {currentTable === 'Customers' && 
        <Customers
          paginatedCustomers = {paginatedCustomers}
          columnWidthsCustomers={columnWidthsCustomers}
        />
      }
      
      {currentTable === 'Products' && 
        <Products
          paginatedProducts = {paginatedProducts}
          columnWidthsProducts={columnWidthsProducts}
        />
      }

       {currentTable === 'Orders' && 
        <OrderItems
          paginatedOrders = {paginatedOrders}
          columnWidthsOrders={columnWidthsOrders}
        />
       }


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
