import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
} from "date-fns";

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
}

export function getCalendarDays(currentMonth: Date): CalendarDay[] {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);

  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 }); // Monday
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  return days.map((date) => ({
    date,
    isCurrentMonth: isSameMonth(date, currentMonth),
  }));
}