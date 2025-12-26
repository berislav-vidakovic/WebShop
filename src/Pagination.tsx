
export const Pagination = ({
  currentPage,
  totalPages,
  goFirst,
  goPrev,
  goNext,
  goLast
}: {
  currentPage: number;
  totalPages: number;
  goFirst: () => void;
  goPrev: () => void;
  goNext: () => void;
  goLast: () => void;
}) => {
  return (
    <div className="pagination">
      <div className="pagination-left">
        <a 
          href="#"
          onClick={(e) => { e.preventDefault(); goFirst(); }}
          className={currentPage === 1 ? "disabled" : ""}
        >
          First
        </a>
        &nbsp;<label>|</label>&nbsp;
        <a 
          href="#"
          onClick={(e) => { e.preventDefault(); goPrev(); }}
          className={currentPage === 1 ? "disabled" : ""}
        >
          Previous
        </a>
      </div>

      <div className="pagination-center">
        Page {currentPage} of {totalPages}
      </div>

      <div className="pagination-right">
        <a 
          href="#"
          onClick={(e) => { e.preventDefault(); goNext(); }}
          className={currentPage === totalPages ? "disabled" : ""}
        >
          Next
        </a>
        &nbsp;<label>|</label>&nbsp;
        <a 
          href="#"
          onClick={(e) => { e.preventDefault(); goLast(); }}
          className={currentPage === totalPages ? "disabled" : ""}
        >
          Last
        </a>
      </div>
    </div>
  );
};
