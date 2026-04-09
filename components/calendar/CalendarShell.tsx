"use client";

import { useEffect, useMemo, useState } from "react";
import { addMonths, differenceInCalendarDays, format, subMonths } from "date-fns";
import { motion } from "framer-motion";

import HeroImagePanel from "../HeroImagePanel";
import CalendarHeader from "./CalendarHeader";
import MonthNavigator from "./MonthNavigator";
import CalendarGrid from "./CalendarGrid";
import RangeSummary from "./RangeSummary";
import NotesPanel from "./NotesPanel";

import { loadNotes, saveNotes } from "@/lib/localStorage";
import { formatRangeKey, normalizeRange } from "@/lib/dateHelpers";
import { monthThemes } from "@/lib/mockImages";
import { NotesMap } from "@/types/calendar";

export default function CalendarShell() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [notes, setNotes] = useState<NotesMap>({});

  useEffect(() => {
    setNotes(loadNotes());
  }, []);

  useEffect(() => {
    saveNotes(notes);
  }, [notes]);

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

  const handleNoteChange = (value: string) => {
    if (!selectedKey) return;
    setNotes((prev) => {
      const next = { ...prev, [selectedKey]: value };
      if (!value.trim()) {
        delete next[selectedKey];
      }
      return next;
    });
  };

  return (
    <div
      className="min-h-screen w-full px-4 py-6 md:px-8 md:py-10"
      style={{ backgroundColor: theme.bg }}
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-0 overflow-hidden rounded-4xl shadow-2xl lg:grid-cols-[1.05fr_1fr]">
          {/* LEFT: HERO */}
          <HeroImagePanel
            imageSrc={theme.image}
            monthLabel={format(currentMonth, "MMMM")}
            yearLabel={format(currentMonth, "yyyy")}
            primary={theme.primary}
          />

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

            <CalendarGrid
              currentMonth={currentMonth}
              startDate={startDate}
              endDate={endDate}
              hoverDate={hoverDate}
              onDateClick={handleDateClick}
              onDateHover={handleDateHover}
              primary={theme.primary}
              accent={theme.accent}
            />

            <div className="mt-6 grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
              <RangeSummary
                startDate={startDate}
                endDate={endDate}
                primary={theme.primary}
                selectedDays={selectedDays}
              />
              <NotesPanel
                selectedKey={selectedKey}
                noteValue={noteValue}
                onChange={handleNoteChange}
                primary={theme.primary}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}