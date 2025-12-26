import type { Dispatch, SetStateAction } from "react";
import type { TableType } from "../interfaces";

export const Selector = ({
  currentTable,
  setCurrentPage,
  initializeView
}: {
  currentTable: TableType;
  setCurrentPage: Dispatch<SetStateAction<number>>,
  initializeView: (table: TableType) => void; 
}) => {
  return (
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
      );
    }