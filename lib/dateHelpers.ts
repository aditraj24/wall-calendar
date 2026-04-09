import {
  format,
  isSameDay,
  isWithinInterval,
  startOfDay,
  endOfDay,
} from "date-fns";

export function isSameDate(a: Date | null, b: Date | null) {
  if (!a || !b) return false;
  return isSameDay(a, b);
}

export function normalizeRange(start: Date, end: Date) {
  return start <= end ? { start, end } : { start: end, end: start };
}

export function isDateInRange(
  date: Date,
  start: Date | null,
  end: Date | null
) {
  if (!start || !end) return false;
  const normalized = normalizeRange(start, end);

  return isWithinInterval(date, {
    start: startOfDay(normalized.start),
    end: endOfDay(normalized.end),
  });
}

export function isPreviewInRange(
  date: Date,
  start: Date | null,
  hover: Date | null,
  end: Date | null
) {
  if (!start || !hover || end) return false;
  const normalized = normalizeRange(start, hover);

  return isWithinInterval(date, {
    start: startOfDay(normalized.start),
    end: endOfDay(normalized.end),
  });
}

export function formatRangeKey(start: Date | null, end: Date | null) {
  if (!start) return null;
  if (!end) return format(start, "yyyy-MM-dd");
  const normalized = normalizeRange(start, end);
  return `${format(normalized.start, "yyyy-MM-dd")}__${format(
    normalized.end,
    "yyyy-MM-dd"
  )}`;
}

export function formatPrettyDate(date: Date | null) {
  if (!date) return "";
  return format(date, "MMM d, yyyy");
}