import { formatPrettyDate } from "@/lib/dateHelpers";

type RangeSummaryProps = {
  startDate: Date | null;
  endDate: Date | null;
  primary: string;
  selectedDays: number;
};

export default function RangeSummary({
  startDate,
  endDate,
  primary,
  selectedDays,
}: RangeSummaryProps) {
  return (
    <div
      className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm"
      style={{
        borderColor: `${primary}30`,
      }}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
        Selected Range
      </p>

      {!startDate && !endDate && (
        <p className="mt-2 text-sm text-slate-600">
          Click a date to start selecting your range.
        </p>
      )}

      {startDate && !endDate && (
        <p className="mt-2 text-sm font-medium text-slate-700">
          Start: {formatPrettyDate(startDate)} <br />
          <span className="text-slate-500">Now choose an end date or save a note for this date.</span>
        </p>
      )}

      {startDate && endDate && (
        <>
          <p className="mt-2 text-sm font-semibold text-slate-800">
            {formatPrettyDate(startDate)} → {formatPrettyDate(endDate)}
          </p>
          <p className="mt-3 text-sm text-slate-500">
            {selectedDays} day{selectedDays > 1 ? "s" : ""} selected.
          </p>
        </>
      )}
    </div>
  );
}