"use client";

import { useEffect, useMemo, useState } from "react";
import {
  addMonths,
  differenceInCalendarDays,
  eachDayOfInterval,
  format,
  parseISO,
  subMonths,
} from "date-fns";
import { motion } from "framer-motion";

import HeroImagePanel from "../HeroImagePanel";
import CalendarHeader from "./CalendarHeader";
import MonthNavigator from "./MonthNavigator";
import CalendarGrid from "./CalendarGrid";
import RangeSummary from "./RangeSummary";
import NotesPanel from "./NotesPanel";
import HolidayPanel from "./HolidayPanel";

import { loadNotes, saveNotes } from "@/lib/localStorage";
import { formatRangeKey, normalizeRange } from "@/lib/dateHelpers";
import { monthThemes } from "@/lib/mockImages";

type HolidayItem = {
  id: string;
  date: string;
  occasion: string;
};

export default function CalendarShell() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [notes, setNotes] = useState(() => loadNotes());
  const [goToInput, setGoToInput] = useState("");
  const [goToError, setGoToError] = useState<string | null>(null);
  const [holidays, setHolidays] = useState<HolidayItem[]>([
    {
      id: "holiday-sample",
      date: format(new Date(), "yyyy-MM-dd"),
      occasion: "Sample holiday",
    },
  ]);

  const theme = monthThemes[currentMonth.getMonth()];

  const selectedKey = useMemo(
    () => formatRangeKey(startDate, endDate),
    [startDate, endDate]
  );

  const selectedDays = useMemo(() => {
    if (!startDate) return 0;
    if (!endDate) return 1;
    const normalized = normalizeRange(startDate, endDate);
    return differenceInCalendarDays(normalized.end, normalized.start) + 1;
  }, [startDate, endDate]);

  const noteValue = selectedKey ? notes[selectedKey] || "" : "";

  const handleNoteChange = (value: string) => {
    if (!selectedKey) return;
    setNotes((prev) => ({ ...prev, [selectedKey]: value }));
  };

  const handleClearNote = () => {
    if (!selectedKey) return;
    setNotes((prev) => {
      const next = { ...prev };
      delete next[selectedKey];
      return next;
    });
  };

  useEffect(() => {
    saveNotes(notes);
  }, [notes]);

  const holidayMap = useMemo(
    () => new Map(holidays.map((holiday) => [holiday.date, holiday])),
    [holidays]
  );

  const parseDdMmYyyy = (value: string) => {
    const digits = value.replace(/\D/g, "");
    if (digits.length !== 8) return null;

    const day = Number(digits.slice(0, 2));
    const month = Number(digits.slice(2, 4));
    const year = Number(digits.slice(4, 8));
    const date = new Date(year, month - 1, day);

    if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
      return null;
    }

    return date;
  };

  const handleGoToDate = () => {
    const result = parseDdMmYyyy(goToInput);
    if (!result) {
      setGoToError("Enter a valid date in ddmmyyyy format.");
      return;
    }

    setGoToError(null);
    setCurrentMonth(result);
    setStartDate(result);
    setEndDate(null);
    setHoverDate(null);
  };

  const handleAddHoliday = (date: string, occasion: string) => {
    setHolidays((prev) => [
      { id: `${date}-${occasion}-${prev.length + 1}`, date, occasion },
      ...prev,
    ]);
  };

  const handleRemoveHoliday = (id: string) => {
    setHolidays((prev) => prev.filter((holiday) => holiday.id !== id));
  };

  const handleDateClick = (clickedDate: Date) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(clickedDate);
      setEndDate(null);
      setHoverDate(null);
      return;
    }

    if (startDate && !endDate) {
      const normalized = normalizeRange(startDate, clickedDate);
      setStartDate(normalized.start);
      setEndDate(normalized.end);
    }
  };

  const handleDateHover = (date: Date) => {
    if (startDate && !endDate) {
      setHoverDate(date);
    }
  };


  return (
    <div
      className="min-h-screen w-full px-4 py-6 md:px-8 md:py-10"
      style={{ backgroundColor: theme.bg }}
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-0 overflow-hidden rounded-4xl shadow-2xl lg:grid-cols-[1.05fr_1fr]">
          <div className="space-y-5">
            <HeroImagePanel
              imageSrc={theme.image}
              monthLabel={format(currentMonth, "MMMM")}
              yearLabel={format(currentMonth, "yyyy")}
            />
            <div className="hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:block">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Jump to date
              </p>
              <p className="mt-2 text-sm text-slate-600">
                Enter ddmmyyyy to open that date on the calendar.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <input
                  value={goToInput}
                  onChange={(e) => setGoToInput(e.target.value)}
                  placeholder="ddmmyyyy"
                  className="min-w-[180px] rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-400"
                />
                <button
                  type="button"
                  onClick={handleGoToDate}
                  className="rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                  style={{ backgroundColor: theme.primary }}
                >
                  Go
                </button>
              </div>
              {goToError ? (
                <p className="mt-3 text-sm text-rose-600">{goToError}</p>
              ) : null}
            </div>
          </div>

          {/* RIGHT: CALENDAR PANEL */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="bg-white p-5 md:p-7 lg:border-l lg:border-slate-200/70"
          >
            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <CalendarHeader currentMonth={currentMonth} />
                <p className="mt-2 text-sm text-slate-500">
                  {selectedDays > 1
                    ? `${selectedDays} days selected`
                    : selectedDays === 1
                    ? "Single day selected"
                    : "Select a date or range to view details."}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setCurrentMonth(new Date())}
                  className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-100"
                >
                  Today
                </button>
                <button
                  onClick={() => {
                    setStartDate(null);
                    setEndDate(null);
                    setHoverDate(null);
                  }}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  Clear
                </button>
                <MonthNavigator
                  onPrev={() => setCurrentMonth((prev) => subMonths(prev, 1))}
                  onNext={() => setCurrentMonth((prev) => addMonths(prev, 1))}
                  primary={theme.primary}
                />
              </div>
            </div>

            <motion.div
              key={currentMonth.toISOString()}
              initial={{ opacity: 0, y: 12, rotateX: 15 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.35 }}
            >
              <CalendarGrid
                currentMonth={currentMonth}
                startDate={startDate}
                endDate={endDate}
                hoverDate={hoverDate}
                onDateClick={handleDateClick}
                onDateHover={handleDateHover}
                primary={theme.primary}
                accent={theme.accent}
                holidayMap={holidayMap}
              />
            </motion.div>

            <div className="mt-6">
              <RangeSummary
                startDate={startDate}
                endDate={endDate}
                primary={theme.primary}
                selectedDays={selectedDays}
              />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-6xl lg:mt-10">
        <div className="grid gap-4 lg:grid-cols-[1fr_0.95fr]">
          <HolidayPanel
            holidays={holidays}
            onAddHoliday={handleAddHoliday}
            onRemoveHoliday={handleRemoveHoliday}
            primary={theme.primary}
            className="order-2 lg:order-1"
          />
          <NotesPanel
            selectedKey={selectedKey}
            noteValue={noteValue}
            onChange={handleNoteChange}
            onClear={handleClearNote}
            primary={theme.primary}
            className="order-1 lg:order-2"
          />
        </div>
      </div>
    </div>
  );
}