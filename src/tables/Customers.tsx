import type { Customer } from "../interfaces";

export const Customers = ({
  paginatedCustomers,
  columnWidthsCustomers
}: {
  paginatedCustomers: Customer[];
  columnWidthsCustomers: number[];
}) => {
  return (
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
      );
    }