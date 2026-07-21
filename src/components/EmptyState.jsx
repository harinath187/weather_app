export function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-700">
      <p className="text-3xl">🌤️</p>
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
        Search for a city or use your location
      </h2>
      <p className="max-w-sm text-sm text-slate-500 dark:text-slate-400">
        Get current conditions, an hourly outlook, and a 7-day forecast for anywhere in the world.
      </p>
    </div>
  );
}
