import { useState, useEffect } from 'react'
import './App.css'
import { fetchCustomers,  fetchProducts, fetchOrderItems } from './graphQL/queries'
import type { Customer, OrderView, Product, OrderItem, OrderDraftItem } from './interfaces'
import './style.css'
import { useOrdersSubscription } from './graphQL/subscriptions';
import { Pagination  } from './Pagination'
import { getTableView, getMasterView } from './views';
import type { TableType } from './interfaces';
import { Customers } from './tables/Customers'
import { Products } from './tables/Products'
import { OrderItems } from './tables/Orders'
import { Selector } from './tables/Selector'
import { Master } from './tables/Master'
import { PlaceOrderDialog } from './dialogs/PlaceOrder'
import { placeNewOrderMutation } from './graphQL/mutations'

function App() {
  const [currentTable, setCurrentTable] = useState<TableType>("Customers");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [ordersMaster, setOrdersMaster] = useState<OrderView[]>([]);

  const [totalPages, setTotalPages] = useState<number>(0); 
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [totalPagesMaster, setTotalPagesMaster] = useState<number>(0); 
  const [currentPageMaster, setCurrentPageMaster] = useState<number>(1);

  const [paginatedCustomers, setPaginatedCustomers] = useState<Customer[]>([]);
  const [columnWidthsCustomers, setColumnWidthsCustomers] = useState<number[]>([]);

  const [paginatedProducts, setPaginatedProducts] = useState<Product[]>([]);
  const [columnWidthsProducts, setColumnWidthsProducts] = useState<number[]>([]);

  const [paginatedOrders, setPaginatedOrders] = useState<OrderItem[]>([]);
  const [columnWidthsOrders, setColumnWidthsOrders] = useState<number[]>([]);

  const [paginatedMaster, setPaginatedMaster] = useState<OrderView[]>([]);
  const [columnWidthsMaster, setColumnWidthsMaster] = useState<number[]>([]);

  // Place order-related states
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [draftItems, setDraftItems] = useState<OrderDraftItem[]>([]);
  
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

  useEffect(() => {
    initializeViewMaster();
  }, [ordersMaster, currentPageMaster]);

  const goFirst = () => setCurrentPage(1);
  const goPrev = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const goNext = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const goLast = () => setCurrentPage(totalPages);

  const goFirstMaster = () => setCurrentPageMaster(1);
  const goPrevMaster = () => setCurrentPageMaster(prev => Math.max(prev - 1, 1));
  const goNextMaster = () => setCurrentPageMaster(prev => Math.min(prev + 1, totalPagesMaster));
  const goLastMaster = () => setCurrentPageMaster(totalPagesMaster);


  const setPageCount = ( table: TableType) =>{
    let len = customers.length;
    if( table === "Products")
      len = products.length;
    else if( table === "Orders" )
      len = orderItems.length;

    setTotalPages(Math.ceil(len / rowsPerPage));
  }

  const initializeViewMaster = () => {
    const len = ordersMaster.length;
    const pages = Math.ceil(len / rowsPerPage);
    setTotalPagesMaster(pages);

    // compute paginated data
    const page = Math.min(currentPageMaster, pages === 0 ? 1 : pages);
    const { paginatedData, columnWidths } = getMasterView(
      ordersMaster, page, rowsPerPage
    );

    setPaginatedMaster(paginatedData);
    setColumnWidthsMaster(columnWidths);
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

        {showCreateDialog && (
          <PlaceOrderDialog
            customers={customers}
            products={products}
            onCancel={() => setShowCreateDialog(false)}
            onComplete={(customerId, items) => {
              console.log("ORDER DRAFT", customerId, items);
              placeNewOrderMutation(customerId, items);
              setShowCreateDialog(false);
            }}
          />
        )}

        {/* Action buttons */}
        <div className="actions">
          <button onClick={() => {
              if(currentTable === 'Orders') setShowCreateDialog(true);
            }
          }>
            Create
          </button>
          <button>Update</button>
          {currentTable === 'Orders' && <button>Delete</button>}
          <button>Filter</button>
          <button>Sort</button>

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
        />}
      
      {currentTable === 'Products' && 
        <Products
          paginatedProducts = {paginatedProducts}
          columnWidthsProducts={columnWidthsProducts}
        />}

      {currentTable === 'Orders' && 
        <OrderItems
          paginatedOrders = {paginatedOrders}
          columnWidthsOrders={columnWidthsOrders}
        />}


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
      
      {/* Pagination */}
      <Pagination
        currentPage={currentPageMaster}
        totalPages={totalPagesMaster}
        goFirst={goFirstMaster}
        goPrev={goPrevMaster}
        goNext={goNextMaster}
        goLast={goLastMaster}
      />

      {/* Order overview table */}
      <Master
        paginatedMaster={paginatedMaster}
        columnWidthsMaster={columnWidthsMaster}
      />

    </div>
  )
}

export default App
