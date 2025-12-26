import type { OrderItem } from "../interfaces";

export const OrderItems = ({
  paginatedOrders,
  columnWidthsOrders
}: {
  paginatedOrders: OrderItem[];
  columnWidthsOrders: number[];
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
      );
    }