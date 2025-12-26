import type { OrderView } from "../interfaces";

export const Master = ({
  paginatedMaster,
  columnWidthsMaster
}: {
  paginatedMaster: OrderView[];
  columnWidthsMaster: number[];
}) => {
  return (
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
            {paginatedMaster.map(o => (
              <tr key={o.id} className={o.id % 2 !== 0 ? "odd-row-master" : ""}>
                <td className="cell-center" style={{ width: `${columnWidthsMaster[0]}ch` }}>{o.id}</td>
                <td style={{ width: `${columnWidthsMaster[1]}ch` }}>{o.customer}</td>
                <td className="cell-center" style={{ width: `${columnWidthsMaster[2]}ch` }}>{o.products}</td>
                <td className="cell-right" style={{ width: `${columnWidthsMaster[3]}ch` }}>{o.amountUSD}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      );
    }