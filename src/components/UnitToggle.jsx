import { useUnit } from '../context/UnitContext';

export function UnitToggle() {
  const { isMetric, toggleUnit } = useUnit();

  return (
    <button
      type="button"
      onClick={toggleUnit}
      aria-label={`Switch to ${isMetric ? 'Fahrenheit' : 'Celsius'}`}
      className="flex items-center gap-1 rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
    >
      <span className={isMetric ? 'text-sky-600 dark:text-sky-400' : 'text-slate-400'}>°C</span>
      <span className="text-slate-300 dark:text-slate-600">/</span>
      <span className={!isMetric ? 'text-sky-600 dark:text-sky-400' : 'text-slate-400'}>°F</span>
    </button>
  );
}
