import { useUnit } from '../context/UnitContext';
import { formatTemp } from '../utils/format';

function ForecastRow({ day }) {
  const { isMetric } = useUnit();
  const date = new Date(`${day.date}T00:00:00`);
  const label = date.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'short' });

  return (
    <div className="flex items-center justify-between py-2.5">
      <div className="flex items-center gap-3">
        <span className="text-3xl leading-none" role="img" aria-label={day.day.condition.text}>
          {day.day.condition.icon}
        </span>
        <span className="text-sm font-semibold text-text-primary">
          {formatTemp(day.day.maxtemp_c, day.day.maxtemp_f, isMetric)}
        </span>
      </div>
      <span className="text-sm text-text-muted">{label}</span>
    </div>
  );
}

export function FiveDayForecastCard({ days }) {
  const upcoming = (days ?? []).slice(1, 6);

  return (
    <div className="flex h-full flex-col rounded-2xl bg-card-bg p-6">
      <h2 className="mb-2 text-sm font-semibold text-text-muted">5 Days Forecast</h2>
      <div className="flex-1 divide-y divide-border">
        {upcoming.map((day) => (
          <ForecastRow key={day.date} day={day} />
        ))}
      </div>
    </div>
  );
}
