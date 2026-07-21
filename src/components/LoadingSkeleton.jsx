export function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-4" role="status" aria-label="Loading weather data">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="mb-4 h-6 w-40 rounded bg-slate-200 dark:bg-slate-700" />
        <div className="h-12 w-32 rounded bg-slate-200 dark:bg-slate-700" />
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-slate-100 dark:bg-slate-900/40" />
          ))}
        </div>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="flex gap-3 overflow-hidden">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-24 w-[72px] shrink-0 rounded-xl bg-slate-100 dark:bg-slate-900/40" />
          ))}
        </div>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="mb-2 h-10 rounded bg-slate-100 dark:bg-slate-900/40" />
        ))}
      </div>
    </div>
  );
}
