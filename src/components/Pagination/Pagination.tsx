import ReactPaginate from "react-paginate";
import css from "./Pagination.module.css";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onChange: (s: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onChange,
}: PaginationProps) {
  return (
    <>
      <ReactPaginate
        pageCount={totalPages}
        pageRangeDisplayed={5}
        marginPagesDisplayed={1}
        onPageChange={({ selected }) => onChange(selected + 1)}
        forcePage={currentPage - 1}
        containerClassName={css.pagination}
        activeClassName={css.active}
        nextLabel="→"
        previousLabel="←"
      />
    </>
  );
}
