import {
  DAY,
  endOfMonth,
  endOfWeek,
  getMonth,
  getMonthDay,
  getTime,
  getYear,
  MONTH_NAMES,
  serverDate,
  setMonth,
  setMonthDay,
  setYear,
  startOfMonth,
  startOfWeek,
} from '@fluxio/core/date/date';
import { useState } from 'preact/hooks';
import { floor } from '@fluxio/core/number/floor';
import { repeat } from '@fluxio/core/array/repeat';
import { Field } from './Field';

const DAY_WIDTH = 30;

interface CalendarProps {
  now?: Date;
  value?: Date;
  onValue?: (value: Date) => void;
}

export const Calendar = ({}: CalendarProps) => {
  const [value, setValue] = useState(() => serverDate());

  const day = getMonthDay(value);
  const month = getMonth(value);
  const year = getYear(value);

  const monthStart = startOfMonth(value);
  const monthEnd = endOfMonth(value);

  const start = startOfWeek(monthStart);
  const end = endOfWeek(monthEnd);

  const monthDaysCount = getMonthDay(monthEnd);
  const daysCount = floor((getTime(end) - getTime(start)) / DAY);

  console.debug('Calendar', { day, month, year, start, end, monthDaysCount, daysCount });
  
  return (
    <div class="Calendar w-full flex flex-row flex-wrap">
      <Field
        class="CalendarDay w-4"
        type="select"
        value={day}
        onValue={(v) => setValue((d) => setMonthDay(d, v))}
        items={repeat(monthDaysCount, (i) => i + 1).map((d) => [d, d])}
      />
      <Field
        class="CalendarMonth w-10"
        type="select"
        value={month}
        onValue={(v) => setValue((d) => setMonth(d, v))}
        items={MONTH_NAMES.map((name, index) => [index, name])}
      />
      <Field
        class="CalendarYear w-6"
        type="select"
        value={year}
        onValue={(v) => setValue((d) => setYear(d, v))}
        items={[year - 2, year - 1, year, year + 1, year + 2].map((y) => [y, y])}
      />
    </div>
  );
};
