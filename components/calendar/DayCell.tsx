"use client";

import { format } from "date-fns";

type HolidayItem = {
  id: string;
  date: string;
  occasion: string;
};

type DayCellProps = {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isStart: boolean;
  isEnd: boolean;
  isInRange: boolean;
  isPreviewRange: boolean;
  isWeekend: boolean;
  onClick: () => void;
  onHover: () => void;
  primary: string;
  accent: string;
  holiday: HolidayItem | null;
};

export default function DayCell({
  date,
  isCurrentMonth,
  isToday,
  isStart,
  isEnd,
  isInRange,
  isPreviewRange,
  isWeekend,
  onClick,
  onHover,
  primary,
  accent,
  holiday,
}: DayCellProps) {
  const isSelectedEdge = isStart || isEnd;
  const activeRange = isInRange || isPreviewRange;
  const holidayBackground = holiday ? `${accent}20` : "transparent";
  const holidayText = holiday ? "#0f172a" : undefined;

  return (
    <button
      onClick={onClick}
      onMouseEnter={onHover}
      title={holiday?.occasion ?? undefined}
      className={`
        relative flex aspect-square items-center justify-center rounded-2xl border border-transparent text-sm font-medium transition-all duration-200
        hover:z-10 hover:scale-[1.03] hover:border-slate-300 hover:bg-slate-50
        ${!isCurrentMonth ? "text-slate-300" : "text-slate-700"}
      `}
      style={{
        backgroundColor: isSelectedEdge
          ? primary
          : activeRange
          ? `${accent}25`
          : holidayBackground,
        color: isSelectedEdge
          ? "white"
          : holiday
          ? accent
          : undefined,
        border: isToday && !isSelectedEdge ? `1.5px solid ${primary}` : undefined,
      }}
    >
      <span
        className={`relative z-10 ${
          isWeekend && isCurrentMonth && !isSelectedEdge ? "font-semibold" : ""
        }`}
      >
        {format(date, "d")}
      </span>
    </button>
  );
}