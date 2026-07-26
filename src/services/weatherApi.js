const GEOCODE_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const REVERSE_GEOCODE_URL = 'https://api.bigdatacloud.net/data/reverse-geocode-client';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

export class WeatherApiError extends Error {
  constructor(message, code) {
    super(message);
    this.name = 'WeatherApiError';
    this.code = code;
  }
}

// WMO weather codes -> [day icon, night icon, text]
const WEATHER_CODES = {
  0: ['☀️', '🌙', 'Clear sky'],
  1: ['🌤️', '🌙', 'Mainly clear'],
  2: ['⛅', '☁️', 'Partly cloudy'],
  3: ['☁️', '☁️', 'Overcast'],
  45: ['🌫️', '🌫️', 'Fog'],
  48: ['🌫️', '🌫️', 'Depositing rime fog'],
  51: ['🌦️', '🌧️', 'Light drizzle'],
  53: ['🌦️', '🌧️', 'Moderate drizzle'],
  55: ['🌧️', '🌧️', 'Dense drizzle'],
  56: ['🌧️', '🌧️', 'Light freezing drizzle'],
  57: ['🌧️', '🌧️', 'Dense freezing drizzle'],
  61: ['🌦️', '🌧️', 'Slight rain'],
  63: ['🌧️', '🌧️', 'Moderate rain'],
  65: ['🌧️', '🌧️', 'Heavy rain'],
  66: ['🌧️', '🌧️', 'Light freezing rain'],
  67: ['🌧️', '🌧️', 'Heavy freezing rain'],
  71: ['🌨️', '🌨️', 'Slight snow fall'],
  73: ['🌨️', '🌨️', 'Moderate snow fall'],
  75: ['❄️', '❄️', 'Heavy snow fall'],
  77: ['🌨️', '🌨️', 'Snow grains'],
  80: ['🌦️', '🌧️', 'Slight rain showers'],
  81: ['🌧️', '🌧️', 'Moderate rain showers'],
  82: ['⛈️', '⛈️', 'Violent rain showers'],
  85: ['🌨️', '🌨️', 'Slight snow showers'],
  86: ['❄️', '❄️', 'Heavy snow showers'],
  95: ['⛈️', '⛈️', 'Thunderstorm'],
  96: ['⛈️', '⛈️', 'Thunderstorm with slight hail'],
  99: ['⛈️', '⛈️', 'Thunderstorm with heavy hail'],
};

function describeWeather(code, isDay = true) {
  const [dayIcon, nightIcon, text] = WEATHER_CODES[code] ?? ['☁️', '☁️', 'Unknown'];
  return { icon: isDay ? dayIcon : nightIcon, text };
}

function toLocalEpoch(isoLocalTime) {
  const withSeconds = isoLocalTime.length === 16 ? `${isoLocalTime}:00` : isoLocalTime;
  return Math.floor(Date.parse(`${withSeconds}Z`) / 1000);
}

// Open-Meteo returns sunrise/sunset as an ISO string already in the location's
// local time (timezone=auto) — extract the HH:MM directly rather than routing
// through `Date`, which would reinterpret it in the viewer's own timezone.
function formatLocalIsoTime(isoLocalTime) {
  const [, time] = isoLocalTime.split('T');
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${hour12}:${String(minutes).padStart(2, '0')} ${period}`;
}

function cToF(c) {
  return (c * 9) / 5 + 32;
}

function kphToMph(kph) {
  return kph * 0.621371;
}

function mbToIn(mb) {
  return mb * 0.02953;
}

async function fetchJson(url) {
  let response;
  try {
    response = await fetch(url);
  } catch {
    throw new WeatherApiError('Network error. Check your internet connection and try again.', 'network');
  }

  let data;
  try {
    data = await response.json();
  } catch {
    throw new WeatherApiError('Unexpected response from the weather service.', 'parse');
  }

  if (!response.ok) {
    throw new WeatherApiError(data?.reason || 'Something went wrong fetching weather data.', response.status);
  }

  return data;
}

async function geocode(location) {
  const url = new URL(GEOCODE_URL);
  url.searchParams.set('name', location);
  url.searchParams.set('count', '1');
  const data = await fetchJson(url.toString());
  const place = data?.results?.[0];
  if (!place) {
    throw new WeatherApiError('No matching location found. Try a different city name.', 'no_match');
  }
  return place;
}

function buildForecastUrl(latitude, longitude, days) {
  const url = new URL(FORECAST_URL);
  url.searchParams.set('latitude', latitude);
  url.searchParams.set('longitude', longitude);
  url.searchParams.set('current', 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m,surface_pressure,uv_index');
  url.searchParams.set('hourly', 'temperature_2m,weather_code,wind_speed_10m,is_day');
  url.searchParams.set('daily', 'weather_code,temperature_2m_max,sunrise,sunset');
  url.searchParams.set('timezone', 'auto');
  url.searchParams.set('forecast_days', days);
  return url.toString();
}

function buildForecastDay(rawData, dayIndex) {
  const { daily, hourly } = rawData;
  const date = daily.time[dayIndex];
  const dayHours = hourly.time
    .map((time, i) => ({ time, i }))
    .filter(({ time }) => time.startsWith(date))
    .map(({ i }) => {
      const tempC = hourly.temperature_2m[i];
      const windKph = hourly.wind_speed_10m[i];
      return {
        time: hourly.time[i],
        condition: describeWeather(hourly.weather_code[i], hourly.is_day[i] === 1),
        temp_c: tempC,
        temp_f: cToF(tempC),
        wind_kph: windKph,
        wind_mph: kphToMph(windKph),
      };
    });

  const maxTempC = daily.temperature_2m_max[dayIndex];

  return {
    date,
    astro: {
      sunrise: formatLocalIsoTime(daily.sunrise[dayIndex]),
      sunset: formatLocalIsoTime(daily.sunset[dayIndex]),
    },
    day: {
      condition: describeWeather(daily.weather_code[dayIndex], true),
      maxtemp_c: maxTempC,
      maxtemp_f: cToF(maxTempC),
    },
    hour: dayHours,
  };
}

function adaptForecast(place, rawData) {
  const { current } = rawData;

  return {
    location: {
      name: place.name,
      region: place.admin1 ?? '',
      country: place.country ?? '',
      localtime_epoch: toLocalEpoch(current.time),
    },
    current: {
      temp_c: current.temperature_2m,
      temp_f: cToF(current.temperature_2m),
      feelslike_c: current.apparent_temperature,
      feelslike_f: cToF(current.apparent_temperature),
      humidity: current.relative_humidity_2m,
      wind_kph: current.wind_speed_10m,
      wind_mph: kphToMph(current.wind_speed_10m),
      pressure_mb: current.surface_pressure,
      pressure_in: mbToIn(current.surface_pressure),
      uv: current.uv_index ?? '—',
      condition: describeWeather(current.weather_code, current.is_day === 1),
    },
    forecast: {
      forecastday: rawData.daily.time.map((_, i) => buildForecastDay(rawData, i)),
    },
  };
}

const COORD_PATTERN = /^\s*-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?\s*$/;

async function reverseGeocode(latitude, longitude) {
  const url = new URL(REVERSE_GEOCODE_URL);
  url.searchParams.set('latitude', latitude);
  url.searchParams.set('longitude', longitude);
  url.searchParams.set('localityLanguage', 'en');
  try {
    const data = await fetchJson(url.toString());
    return {
      name: data.city || data.locality || data.principalSubdivision || 'Current location',
      admin1: data.principalSubdivision ?? '',
      country: data.countryName ?? '',
    };
  } catch {
    return { name: 'Current location', admin1: '', country: '' };
  }
}

export async function getCurrentWeather(location) {
  const result = await getForecast(location, 1);
  return { location: result.location, current: result.current };
}

export async function getForecast(location, days = 7) {
  let latitude;
  let longitude;
  let place;

  if (COORD_PATTERN.test(location)) {
    [latitude, longitude] = location.split(',').map((part) => part.trim());
    place = await reverseGeocode(latitude, longitude);
  } else {
    place = await geocode(location);
    latitude = place.latitude;
    longitude = place.longitude;
  }

  const rawData = await fetchJson(buildForecastUrl(latitude, longitude, days));
  return adaptForecast(place, rawData);
}

export async function searchLocations(query) {
  const url = new URL(GEOCODE_URL);
  url.searchParams.set('name', query);
  url.searchParams.set('count', '5');
  const data = await fetchJson(url.toString());
  return (data?.results ?? []).map((place) => ({
    id: place.id,
    name: place.name,
    region: place.admin1 ?? '',
    country: place.country ?? '',
    lat: place.latitude,
    lon: place.longitude,
  }));
}
