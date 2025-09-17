import SearchBox from "../SearchBox/SearchBox";
import { useEffect, useState } from "react";
import { fetchNotes } from "../../services/noteService";
import css from "./App.module.css";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import Pagination from "../Pagination/Pagination";
import NoteList from "../NoteList/NoteList";
import { RingLoader } from "react-spinners";
import toast, { Toaster } from "react-hot-toast";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";

export default function App() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [debouncedQuery] = useDebounce(query, 500);

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["notes", debouncedQuery, page],
    queryFn: () => fetchNotes(debouncedQuery, page),
    placeholderData: keepPreviousData,
  });

  const totalPages = data?.totalPages ?? 0;

  function openModal() {
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  useEffect(() => {
    if (isError) {
      toast.error("Couldn't find any notes!");
    } else if (data?.notes.length === 0) {
      toast.error(`No notes found for "${debouncedQuery}"`);
    }
  }, [isError, data, debouncedQuery]);

  return (
    <>
      <div className={css.app}>
        <header className={css.toolbar}>
          <SearchBox
            defValue={query}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setQuery(e.target.value);
              setPage(1);
            }}
          />

          {isSuccess && totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onChange={setPage}
            />
          )}

          <button className={css.button} onClick={openModal}>
            Create note +
          </button>
        </header>

        {isLoading && (
          <RingLoader size="100px" color="#0d6efd" className={css.loader} />
        )}

        {data !== undefined && data?.notes.length > 0 && (
          <NoteList notes={data.notes} />
        )}

        {isModalOpen && (
          <Modal onClose={closeModal}>
            <NoteForm onClose={closeModal} />
          </Modal>
        )}
      </div>
      <Toaster />
    </>
  );
}
