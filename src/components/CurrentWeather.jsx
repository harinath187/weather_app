import { useUnit } from '../context/UnitContext';
import { formatPressure, formatSpeed, formatTemp, formatVisibility, aqiLabel } from '../utils/format';

export function CurrentWeather({ location, current }) {
  const { isMetric } = useUnit();

  const localTime = new Date(location.localtime).toLocaleString(undefined, {
    weekday: 'long',
    hour: 'numeric',
    minute: '2-digit',
  });
  const lastUpdated = new Date(current.last_updated).toLocaleString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });

  const usEpaIndex = current.air_quality?.['us-epa-index'];

  const stats = [
    { label: 'Feels like', value: formatTemp(current.feelslike_c, current.feelslike_f, isMetric) },
    { label: 'Humidity', value: `${current.humidity}%` },
    {
      label: 'Wind',
      value: `${formatSpeed(current.wind_kph, current.wind_mph, isMetric)} ${current.wind_dir}`,
    },
    { label: 'Pressure', value: formatPressure(current.pressure_mb, current.pressure_in, isMetric) },
    { label: 'UV Index', value: current.uv },
    {
      label: 'Visibility',
      value: formatVisibility(current.vis_km, current.vis_miles, isMetric),
    },
  ];

  return (
    <section
      aria-label="Current weather"
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-6"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            {location.name}
            {location.region ? `, ${location.region}` : ''}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {location.country} · {localTime}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <img
            src={`https:${current.condition.icon}`}
            alt={current.condition.text}
            width={64}
            height={64}
          />
          <div>
            <p className="text-4xl font-bold text-slate-900 dark:text-white">
              {formatTemp(current.temp_c, current.temp_f, isMetric)}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{current.condition.text}</p>
          </div>
        </div>
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl bg-slate-50 p-3 text-center dark:bg-slate-900/40">
            <dt className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</dt>
            <dd className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">{stat.value}</dd>
          </div>
        ))}
      </dl>

      {usEpaIndex && (
        <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
          Air Quality Index: <span className="font-medium">{aqiLabel(usEpaIndex)}</span>
        </p>
      )}

      <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">Last updated {lastUpdated}</p>
    </section>
  );
}
