import { useState } from 'react';
import { useUnit } from '../context/UnitContext';
import { formatDay, formatFullDate, formatHour, formatTemp } from '../utils/format';

export function DailyForecast({ days }) {
  const { isMetric } = useUnit();
  const [expandedDate, setExpandedDate] = useState(null);

  return (
    <section
      aria-label="7-day forecast"
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800"
    >
      <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">7-day forecast</h3>
      <ul className="divide-y divide-slate-100 dark:divide-slate-700">
        {days.map((day) => {
          const isExpanded = expandedDate === day.date;
          return (
            <li key={day.date}>
              <button
                type="button"
                onClick={() => setExpandedDate(isExpanded ? null : day.date)}
                aria-expanded={isExpanded}
                className="grid w-full grid-cols-[64px_1fr_auto_auto] items-center gap-3 py-3 text-left sm:grid-cols-[80px_1fr_auto_auto_auto]"
              >
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                  {formatDay(day.date)}
                  <span className="hidden text-slate-400 sm:inline"> · {formatFullDate(day.date)}</span>
                </span>
                <img
                  src={`https:${day.day.condition.icon}`}
                  alt={day.day.condition.text}
                  width={32}
                  height={32}
                  className="justify-self-start"
                />
                <span className="hidden text-xs text-sky-600 dark:text-sky-400 sm:inline">
                  💧 {day.day.daily_chance_of_rain}%
                </span>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  {formatTemp(day.day.maxtemp_c, day.day.maxtemp_f, isMetric)}
                </span>
                <span className="text-sm text-slate-400">
                  {formatTemp(day.day.mintemp_c, day.day.mintemp_f, isMetric)}
                </span>
              </button>

              {isExpanded && (
                <div className="mb-3 flex gap-3 overflow-x-auto pb-2">
                  {day.hour.map((hour) => (
                    <div
                      key={hour.time_epoch}
                      className="flex min-w-[64px] shrink-0 flex-col items-center rounded-xl bg-slate-50 p-2 text-center dark:bg-slate-900/40"
                    >
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {formatHour(hour.time)}
                      </p>
                      <img
                        src={`https:${hour.condition.icon}`}
                        alt={hour.condition.text}
                        width={28}
                        height={28}
                      />
                      <p className="text-xs font-semibold text-slate-900 dark:text-white">
                        {formatTemp(hour.temp_c, hour.temp_f, isMetric)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
