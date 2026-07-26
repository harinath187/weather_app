import { Wind } from 'lucide-react';
import { useUnit } from '../context/UnitContext';
import { formatTemp, formatSpeed } from '../utils/format';

const SLOTS = ['12:00', '15:00', '18:00', '21:00', '00:00'];

const LIGHT_GRADIENTS = [
  'bg-gradient-to-b from-amber-300 to-amber-100 dark:from-transparent dark:to-transparent',
  'bg-gradient-to-b from-amber-200 to-sky-100 dark:from-transparent dark:to-transparent',
  'bg-gradient-to-b from-sky-200 to-sky-300 dark:from-transparent dark:to-transparent',
  'bg-gradient-to-b from-sky-300 to-indigo-300 dark:from-transparent dark:to-transparent',
  'bg-gradient-to-b from-indigo-300 to-indigo-400 dark:from-transparent dark:to-transparent',
];

function findHour(hours, label) {
  return hours.find((hour) => hour.time.endsWith(label));
}

function buildSlots(days) {
  const todayHours = days?.[0]?.hour ?? [];
  const tomorrowHours = days?.[1]?.hour ?? [];

  return SLOTS.map((label) => {
    const hour = label === '00:00' ? findHour(tomorrowHours, label) : findHour(todayHours, label);
    return { label, hour };
  });
}

function HourlyCell({ label, hour, gradientClass }) {
  const { isMetric } = useUnit();
  if (!hour) return null;

  return (
    <div
      className={`flex flex-1 flex-col items-center gap-2 rounded-xl bg-card-bg py-4 dark:bg-[#232323] ${gradientClass}`}
    >
      <span className="text-xs font-medium text-text-muted">{label}</span>
      <img src={`https:${hour.condition.icon}`} alt={hour.condition.text} className="h-9 w-9" />
      <span className="text-sm font-semibold text-text-primary">
        {formatTemp(hour.temp_c, hour.temp_f, isMetric)}
      </span>
      <span className="flex items-center gap-1 text-[11px] text-text-muted">
        <Wind className="h-3 w-3" strokeWidth={1.5} />
        {formatSpeed(hour.wind_kph, hour.wind_mph, isMetric)}
      </span>
    </div>
  );
}

export function HourlyForecastCard({ days }) {
  const slots = buildSlots(days);

  return (
    <div className="flex h-full flex-col rounded-2xl bg-card-bg p-6">
      <h2 className="mb-3 text-sm font-semibold text-text-muted">Hourly Forecast:</h2>
      <div className="flex flex-1 gap-2">
        {slots.map((slot, index) => (
          <HourlyCell
            key={slot.label}
            label={slot.label}
            hour={slot.hour}
            gradientClass={LIGHT_GRADIENTS[index]}
          />
        ))}
      </div>
    </div>
  );
}
