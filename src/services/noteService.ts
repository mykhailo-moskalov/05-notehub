import type { Note } from "../types/note";
import axios from "axios";

interface NotesHTTPResponse {
  notes: Note[];
  totalPages: number;
}

interface Options {
  params: {
    search: string;
    page: number;
  };
  headers: {
    Authorization: string;
  };
}

const NOTEHUB_TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;
axios.defaults.baseURL = "https://notehub-public.goit.study/api";

export const fetchNotes = async (
  search: string,
  page: number
): Promise<NotesHTTPResponse> => {
  const options: Options = {
    params: {
      search: search,
      page: page,
    },
    headers: {
      Authorization: `Bearer ${NOTEHUB_TOKEN}`,
    },
  };

  const resp = await axios.get<NotesHTTPResponse>("/notes", options);

  return resp.data;
};

export const createNote = async ({
  title,
  content,
  tag,
}: Note): Promise<Note> => {
  const newNote = {
    title: title,
    content: content,
    tag: tag,
  };

  await axios.post("/notes", newNote);

  return newNote;
};

export const deleteNote = async ({ id }: Note): Promise<void> => {
  await axios.delete(`/notes/${id}`);

  return;
};
