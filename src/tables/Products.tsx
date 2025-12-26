import type { Product } from "../interfaces";

export const Products = ({
  paginatedProducts,
  columnWidthsProducts
}: {
  paginatedProducts: Product[];
  columnWidthsProducts: number[];
}) => {
  return (
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
      );
    }