"use client";

import { format } from "date-fns";

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
}: DayCellProps) {
  const isSelectedEdge = isStart || isEnd;
  const activeRange = isInRange || isPreviewRange;

  return (
    <button
      onClick={onClick}
      onMouseEnter={onHover}
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
          : "transparent",
        color: isSelectedEdge ? "white" : undefined,
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