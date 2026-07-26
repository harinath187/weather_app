import { Droplets, Wind, Sunrise, Sunset, Gauge, SunMedium } from 'lucide-react';
import { useUnit } from '../context/UnitContext';
import { formatTemp, formatSpeed, formatPressure } from '../utils/format';

function StatRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="h-4 w-4 shrink-0 text-text-muted" strokeWidth={1.5} />
      <span className="flex-1 text-xs text-text-muted">{label}</span>
      <span className="text-xs font-semibold text-text-primary">{value}</span>
    </div>
  );
}

export function CurrentWeatherCard({ current, astro }) {
  const { isMetric, toggleUnit } = useUnit();

  if (!current) return null;

  return (
    <div className="grid h-full grid-cols-2 gap-4 rounded-2xl bg-card-bg p-6">
      <div className="flex flex-col items-center justify-center text-center">
        <button
          type="button"
          onClick={toggleUnit}
          className="text-5xl font-bold leading-none text-text-primary transition hover:text-accent-green"
          aria-label="Toggle temperature unit"
        >
          {formatTemp(current.temp_c, current.temp_f, isMetric)}
        </button>
        <p className="mt-2 text-xs text-text-muted">
          Feels like {formatTemp(current.feelslike_c, current.feelslike_f, isMetric)}
        </p>
        <span className="mt-3 text-5xl leading-none" role="img" aria-label={current.condition.text}>
          {current.condition.icon}
        </span>
        <p className="text-sm font-medium text-text-primary">{current.condition.text}</p>
      </div>

      <div className="flex flex-col justify-center gap-3">
        <StatRow icon={Droplets} label="Humidity" value={`${current.humidity}%`} />
        <StatRow
          icon={Wind}
          label="Wind Speed"
          value={formatSpeed(current.wind_kph, current.wind_mph, isMetric)}
        />
        <StatRow icon={Sunrise} label="Sunrise" value={astro?.sunrise ?? '—'} />
        <StatRow icon={Sunset} label="Sunset" value={astro?.sunset ?? '—'} />
        <StatRow
          icon={Gauge}
          label="Pressure"
          value={formatPressure(current.pressure_mb, current.pressure_in, isMetric)}
        />
        <StatRow icon={SunMedium} label="UV Index" value={current.uv} />
      </div>
    </div>
  );
}
