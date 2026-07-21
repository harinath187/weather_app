import { useUnit } from '../context/UnitContext';
import { formatHour, formatTemp } from '../utils/format';

export function HourlyForecast({ hours }) {
  const { isMetric } = useUnit();
  const now = Date.now();
  const upcoming = hours.filter((hour) => new Date(hour.time).getTime() >= now).slice(0, 24);
  const list = upcoming.length > 0 ? upcoming : hours.slice(0, 24);

  return (
    <section
      aria-label="Hourly forecast"
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800"
    >
      <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">Next 24 hours</h3>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {list.map((hour) => (
          <div
            key={hour.time_epoch}
            className="flex min-w-[72px] shrink-0 flex-col items-center rounded-xl bg-slate-50 p-3 text-center dark:bg-slate-900/40"
          >
            <p className="text-xs text-slate-500 dark:text-slate-400">{formatHour(hour.time)}</p>
            <img
              src={`https:${hour.condition.icon}`}
              alt={hour.condition.text}
              width={36}
              height={36}
              className="my-1"
            />
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              {formatTemp(hour.temp_c, hour.temp_f, isMetric)}
            </p>
            <p className="text-xs text-sky-600 dark:text-sky-400">{hour.chance_of_rain}%</p>
          </div>
        ))}
      </div>
    </section>
  );
}
