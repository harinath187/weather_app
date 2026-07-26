import { useCallback, useEffect, useState } from 'react';
import { TopBar } from './components/TopBar';
import { LocationTimeCard } from './components/LocationTimeCard';
import { CurrentWeatherCard } from './components/CurrentWeatherCard';
import { FiveDayForecastCard } from './components/FiveDayForecastCard';
import { HourlyForecastCard } from './components/HourlyForecastCard';
import { useWeather } from './hooks/useWeather';
import { useRecentLocations } from './context/LocationContext';

function CardSkeleton() {
  return <div className="h-full animate-pulse rounded-2xl bg-card-bg" />;
}

function ErrorBanner({ message, onRetry }) {
  return (
    <div className="col-span-2 flex flex-col items-center gap-3 rounded-2xl bg-card-bg p-8 text-center">
      <p className="text-sm font-medium text-red-400">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-full bg-accent-green px-4 py-2 text-sm font-semibold text-white"
        >
          Try again
        </button>
      )}
    </div>
  );
}

function EmptyBanner() {
  return (
    <div className="col-span-2 flex flex-col items-center justify-center gap-2 rounded-2xl bg-card-bg p-10 text-center">
      <p className="text-sm font-medium text-text-primary">Search for a city or use your current location</p>
      <p className="text-xs text-text-muted">Weather details will appear here once a location is loaded.</p>
    </div>
  );
}

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
              runFetch(`${position.coords.latitude},${position.coords.longitude}`);
            });
          }
        })
        .catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-app-bg">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-6 sm:px-6 lg:py-8">
        <TopBar onSelectLocation={runFetch} />

        <main className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-2">
          {loading && (
            <>
              <div className="grid grid-rows-2 gap-4">
                <CardSkeleton />
                <CardSkeleton />
              </div>
              <div className="grid grid-rows-2 gap-4">
                <CardSkeleton />
                <CardSkeleton />
              </div>
            </>
          )}

          {!loading && error && (
            <ErrorBanner message={error} onRetry={lastQuery ? () => runFetch(lastQuery) : undefined} />
          )}

          {!loading && !error && !hasSearched && <EmptyBanner />}

          {!loading && !error && data && (
            <>
              <div className="grid grid-rows-2 gap-4">
                <LocationTimeCard location={data.location} />
                <FiveDayForecastCard days={data.forecast.forecastday} />
              </div>
              <div className="grid grid-rows-2 gap-4">
                <CurrentWeatherCard
                  current={data.current}
                  astro={data.forecast.forecastday[0]?.astro}
                />
                <HourlyForecastCard days={data.forecast.forecastday} />
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
