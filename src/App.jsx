import { useCallback, useEffect, useState } from 'react';
import { SearchBar } from './components/SearchBar';
import { UnitToggle } from './components/UnitToggle';
import { CurrentWeather } from './components/CurrentWeather';
import { HourlyForecast } from './components/HourlyForecast';
import { DailyForecast } from './components/DailyForecast';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { ErrorMessage } from './components/ErrorMessage';
import { EmptyState } from './components/EmptyState';
import { useWeather } from './hooks/useWeather';
import { useRecentLocations } from './context/LocationContext';

function App() {
  const { data, loading, error, fetchWeather } = useWeather();
  const { addRecent } = useRecentLocations();
  const [hasSearched, setHasSearched] = useState(false);
  const [lastQuery, setLastQuery] = useState(null);

  const runFetch = useCallback(
    async (query) => {
      setHasSearched(true);
      setLastQuery(query);
      try {
        const result = await fetchWeather(query);
        if (result) {
          addRecent({
            name: result.location.name,
            region: result.location.region,
            country: result.location.country,
          });
        }
      } catch {
        // error state is handled by useWeather
      }
    },
    [fetchWeather, addRecent]
  );

  useEffect(() => {
    if (navigator.permissions?.query) {
      navigator.permissions
        .query({ name: 'geolocation' })
        .then((status) => {
          if (status.state === 'granted') {
            navigator.geolocation.getCurrentPosition((position) => {
              runFetch(`${position.coords.latitude},${position.coords.longitude}`, null);
            });
          }
        })
        .catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:py-10">
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1">
            <h1 className="mb-3 text-2xl font-bold text-slate-900 dark:text-white">Weather</h1>
            <SearchBar onSelectLocation={runFetch} />
          </div>
          <UnitToggle />
        </header>

        <main className="space-y-4">
          {loading && <LoadingSkeleton />}
          {!loading && error && (
            <ErrorMessage message={error} onRetry={lastQuery ? () => runFetch(lastQuery) : undefined} />
          )}
          {!loading && !error && !hasSearched && <EmptyState />}
          {!loading && !error && data && (
            <>
              <CurrentWeather location={data.location} current={data.current} />
              <HourlyForecast hours={data.forecast.forecastday[0].hour} />
              <DailyForecast days={data.forecast.forecastday} />
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
