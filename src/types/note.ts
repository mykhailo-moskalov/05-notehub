export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tag: NoteTag;
}

export enum NoteTag {
  Work = "Work",
  Personal = "Personal",
  Meeting = "Meeting",
  Shopping = "Shopping",
  Todo = "Todo",
}

export interface NoteFormValues {
  title: string;
  content: string;
  tag: string;
}
