const BASE_URL = 'https://api.weatherapi.com/v1';
const API_KEY = import.meta.env.VITE_WEATHERAPI_KEY;

export class WeatherApiError extends Error {
  constructor(message, code) {
    super(message);
    this.name = 'WeatherApiError';
    this.code = code;
  }
}

async function request(path, params) {
  if (!API_KEY) {
    throw new WeatherApiError(
      'Missing API key. Add VITE_WEATHERAPI_KEY to your .env file.',
      'no_key'
    );
  }

  const url = new URL(`${BASE_URL}${path}`);
  url.searchParams.set('key', API_KEY);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, value);
    }
  });

  let response;
  try {
    response = await fetch(url.toString());
  } catch {
    throw new WeatherApiError(
      'Network error. Check your internet connection and try again.',
      'network'
    );
  }

  let data;
  try {
    data = await response.json();
  } catch {
    throw new WeatherApiError('Unexpected response from the weather service.', 'parse');
  }

  if (!response.ok) {
    const apiCode = data?.error?.code;
    const message = data?.error?.message || 'Something went wrong fetching weather data.';
    throw new WeatherApiError(message, apiCode ?? response.status);
  }

  return data;
}

export function getCurrentWeather(location) {
  return request('/current.json', { q: location, aqi: 'yes' });
}

export function getForecast(location, days = 7) {
  return request('/forecast.json', { q: location, days, aqi: 'yes', alerts: 'yes' });
}

export function searchLocations(query) {
  return request('/search.json', { q: query });
}
