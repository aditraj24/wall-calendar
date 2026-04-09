import { NotesMap } from "@/types/calendar";

const STORAGE_KEY = "wall-calendar-notes";

export function loadNotes(): NotesMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveNotes(notes: NotesMap) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}