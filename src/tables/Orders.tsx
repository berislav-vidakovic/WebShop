import type { Dispatch, SetStateAction } from "react";
import type { OrderItem } from "../interfaces";

export const OrderItems = ({
  paginatedOrders,
  columnWidthsOrders,
  setShowEditDialog,
  setSelectedOrderId

}: {
  paginatedOrders: OrderItem[];
  columnWidthsOrders: number[];
  setShowEditDialog: Dispatch<SetStateAction<boolean>>;
  setSelectedOrderId: Dispatch<SetStateAction<number>>;
  
}) => {
  return (
        <div className="table-container">
            <table className="table-def">
              <thead>
                <tr>
                  <th className="cell-center">Order ID</th>
                  <th>Customer</th>
                  <th className="cell-center">Product</th>
                  <th className="cell-center">Quantity</th>
                  <th className="cell-right">Price $</th>
                  <th className="cell-right">SubTotal $</th>
                  <th className="cell-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedOrders.map(oi => (
                  <tr key={oi.orderId + oi.product} className={oi.orderId % 2 !== 0 ? "odd-row" : ""}>
                    <td className="cell-center" style={{ width: `${columnWidthsOrders[0]}ch` }}>{oi.orderId}</td>
                    <td style={{ width: `${columnWidthsOrders[1]}ch` }}>{oi.customer}</td>
                    <td className="cell-center" style={{ width: `${columnWidthsOrders[2]}ch` }}>{oi.product}</td>
                    <td className="cell-center" style={{ width: `${columnWidthsOrders[3]}ch` }}>{oi.quantity}</td>
                    <td className="cell-right" style={{ width: `${columnWidthsOrders[4]}ch` }}>{oi.price}</td>
                    <td className="cell-right" style={{ width: `${columnWidthsOrders[5]}ch` }}>{oi.subtotal}</td>
                    <td className="cell-center" style={{ width: `${columnWidthsOrders[6]}ch` }}>
                      <button 
                        className="action-button">View</button>
                      <button 
                        className="action-button"
                        onClick= {
                          ()=>{
                            setSelectedOrderId(oi.orderId);
                            setShowEditDialog(true);
                          }
                        }
                      >Edit</button>
                      <button className="action-button">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      );
    }