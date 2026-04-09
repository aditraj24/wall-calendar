"use client";

import { isToday, isWeekend } from "date-fns";
import { getCalendarDays } from "@/lib/calendar";
import { isDateInRange, isPreviewInRange, isSameDate } from "@/lib/dateHelpers";
import DayCell from "./DayCell";

type CalendarGridProps = {
  currentMonth: Date;
  startDate: Date | null;
  endDate: Date | null;
  hoverDate: Date | null;
  onDateClick: (date: Date) => void;
  onDateHover: (date: Date) => void;
  primary: string;
  accent: string;
};

const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function CalendarGrid({
  currentMonth,
  startDate,
  endDate,
  hoverDate,
  onDateClick,
  onDateHover,
  primary,
  accent,
}: CalendarGridProps) {
  const days = getCalendarDays(currentMonth);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-7 gap-2">
        {weekdays.map((day) => (
          <div
            key={day}
            className="py-2 text-center text-xs font-semibold uppercase tracking-[0.18em] text-slate-400"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map(({ date, isCurrentMonth }) => (
          <DayCell
            key={date.toISOString()}
            date={date}
            isCurrentMonth={isCurrentMonth}
            isToday={isToday(date)}
            isStart={isSameDate(date, startDate)}
            isEnd={isSameDate(date, endDate)}
            isInRange={isDateInRange(date, startDate, endDate)}
            isPreviewRange={isPreviewInRange(date, startDate, hoverDate, endDate)}
            isWeekend={isWeekend(date)}
            onClick={() => onDateClick(date)}
            onHover={() => onDateHover(date)}
            primary={primary}
            accent={accent}
          />
        ))}
      </div>
    </div>
  );
}