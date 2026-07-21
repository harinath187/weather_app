import { useCallback, useState } from 'react';
import { getForecast, WeatherApiError } from '../services/weatherApi';

export function useWeather() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeather = useCallback(async (location) => {
    setLoading(true);
    setError(null);
    try {
      const result = await getForecast(location, 7);
      setData(result);
      return result;
    } catch (err) {
      const message =
        err instanceof WeatherApiError
          ? err.code === 1006
            ? 'No matching location found. Try a different city name.'
            : err.message
          : 'Something went wrong. Please try again.';
      setError(message);
      setData(null);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, fetchWeather };
}
