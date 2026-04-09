"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

type MonthNavigatorProps = {
  onPrev: () => void;
  onNext: () => void;
  primary: string;
};

export default function MonthNavigator({
  onPrev,
  onNext,
  primary,
}: MonthNavigatorProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onPrev}
        className="rounded-full border border-slate-200 bg-white p-2 shadow-sm transition hover:scale-105 hover:shadow"
        aria-label="Previous month"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={onNext}
        className="rounded-full p-2 text-white shadow-sm transition hover:scale-105 hover:shadow"
        style={{ backgroundColor: primary }}
        aria-label="Next month"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}