import { format } from "date-fns";

type CalendarHeaderProps = {
  currentMonth: Date;
};

export default function CalendarHeader({
  currentMonth,
}: CalendarHeaderProps) {
  return (
    <div className="space-y-1">
      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
        Wall Calendar
      </p>
      <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
        {format(currentMonth, "MMMM yyyy")}
      </h1>
    </div>
  );
}