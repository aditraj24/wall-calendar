"use client";

import { format, parseISO } from "date-fns";
import { useMemo, useState } from "react";

type HolidayItem = {
  id: string;
  date: string;
  occasion: string;
};

type HolidayPanelProps = {
  holidays: HolidayItem[];
  onAddHoliday: (date: string, occasion: string) => void;
  onRemoveHoliday: (id: string) => void;
  primary: string;
  className?: string;
};

export default function HolidayPanel({
  holidays,
  onAddHoliday,
  onRemoveHoliday,
  primary,
  className,
}: HolidayPanelProps) {
  const [holidayDate, setHolidayDate] = useState("");
  const [holidayOccasion, setHolidayOccasion] = useState("");
  const [error, setError] = useState<string | null>(null);

  const parsedHolidays = useMemo(
    () =>
      holidays.map((holiday) => ({
        ...holiday,
        prettyDate: format(parseISO(holiday.date), "dd MMM yyyy"),
      })),
    [holidays]
  );

  const handleAdd = () => {
    const normalized = holidayDate.replace(/\D/g, "");
    if (normalized.length !== 8) {
      setError("Enter date in ddmmyyyy format.");
      return;
    }

    const day = Number(normalized.slice(0, 2));
    const month = Number(normalized.slice(2, 4));
    const year = Number(normalized.slice(4, 8));
    const date = new Date(year, month - 1, day);

    if (Number.isNaN(date.getTime()) || date.getDate() !== day) {
      setError("Please enter a valid date.");
      return;
    }

    if (!holidayOccasion.trim()) {
      setError("Please add an occasion.");
      return;
    }

    setError(null);
    onAddHoliday(
      format(date, "yyyy-MM-dd"),
      holidayOccasion.trim()
    );
    setHolidayDate("");
    setHolidayOccasion("");
  };

  return (
    <div className={`rounded-3xl border border-slate-200 bg-white p-5 shadow-sm ${className || ""}`}>
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Holidays
          </p>
          <p className="mt-1 text-sm text-slate-600">
            Mark a holiday and it will show up on the calendar.
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-[1.1fr_0.9fr]">
        <div>
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Date
          </label>
          <input
            value={holidayDate}
            onChange={(e) => setHolidayDate(e.target.value)}
            placeholder="ddmmyyyy"
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-400"
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Occasion
          </label>
          <input
            value={holidayOccasion}
            onChange={(e) => setHolidayOccasion(e.target.value)}
            placeholder="E.g. Diwali"
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-400"
          />
        </div>
      </div>

      {error ? (
        <p className="mt-3 text-sm text-rose-600">{error}</p>
      ) : null}

      <button
        type="button"
        onClick={handleAdd}
        className="mt-4 inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
        style={{ backgroundColor: primary }}
      >
        Add holiday
      </button>

      <div className="mt-6 space-y-3">
        {parsedHolidays.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
            Add a holiday to highlight it on the calendar.
          </div>
        ) : (
          parsedHolidays.map((holiday) => (
            <div
              key={holiday.id}
              className="flex flex-col rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {holiday.occasion}
                </p>
                <p className="text-sm text-slate-500">{holiday.prettyDate}</p>
              </div>
              <button
                type="button"
                onClick={() => onRemoveHoliday(holiday.id)}
                className="mt-3 inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-slate-400 hover:bg-slate-100 sm:mt-0"
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
