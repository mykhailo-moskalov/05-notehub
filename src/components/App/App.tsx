import SearchBox from "../SearchBox/SearchBox";
import { useEffect, useState } from "react";
import { deleteNote, fetchNotes } from "../../services/noteService";
import css from "./App.module.css";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import Pagination from "../Pagination/Pagination";
import NoteList from "../NoteList/NoteList";
import { RingLoader } from "react-spinners";
import toast, { Toaster } from "react-hot-toast";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
// import NoteForm from "../NoteForm/NoteForm";

export default function App() {
  const queryClient = useQueryClient();

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
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setQuery(e.target.value)
            }
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
          <NoteList
            notes={data?.notes}
            onDelete={(id) => {
              deleteNote(id)
                .then(() => {
                  toast.success("Note deleted!");
                  queryClient.invalidateQueries({ queryKey: ["notes"] });
                })
                .catch(() => toast.error("Failed to delete note."));
            }}
          />
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
