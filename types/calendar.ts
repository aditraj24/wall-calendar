export type NotesMap = Record<string, string>;

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export interface ThemeConfig {
  name: string;
  image: string;
  primary: string;
  accent: string;
  bg: string;
  text: string;
}