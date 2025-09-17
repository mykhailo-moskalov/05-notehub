import type { Note, NoteFormValues } from "../types/note";
import axios from "axios";

interface NotesHTTPResponse {
  notes: Note[];
  totalPages: number;
}

interface Options {
  params: {
    search: string;
    page: number;
    perPage: number;
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
      perPage: 12,
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
}: NoteFormValues): Promise<NoteFormValues> => {
  const newNote = { title, content, tag };

  const resp = await axios.post<NoteFormValues>("/notes", newNote, {
    headers: {
      Authorization: `Bearer ${NOTEHUB_TOKEN}`,
    },
  });

  return resp.data;
};

export async function deleteNote(id: string): Promise<Note> {
  const resp = await axios.delete<Note>(`/notes/${id}`, {
    headers: {
      Authorization: `Bearer ${NOTEHUB_TOKEN}`,
    },
  });

  return resp.data;
}
