# Weather App

A responsive weather app built with React (Vite) and [WeatherAPI.com](https://www.weatherapi.com/), featuring city search with autocomplete, geolocation, current conditions, hourly and 7-day forecasts, and Celsius/Fahrenheit unit toggling.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Get a free API key from [weatherapi.com](https://www.weatherapi.com/) and add it to a `.env` file in the project root:

   ```bash
   cp .env.example .env
   ```

   Then edit `.env`:

   ```
   VITE_WEATHERAPI_KEY=your_actual_key_here
   ```

3. Start the dev server:

   ```bash
   npm run dev
   ```

## Project structure

```
src/
  components/   UI components (SearchBar, CurrentWeather, HourlyForecast, DailyForecast, UnitToggle, state views)
  hooks/         useWeather, useGeolocation, useDebounce, useLocalStorage
  services/      weatherApi.js — all WeatherAPI.com calls in one place
  context/       UnitContext (°C/°F, persisted) and LocationContext (recent searches, persisted)
  utils/         formatting helpers (temperature/speed/pressure conversion, date/time)
```

## Notes

- The API key is loaded via Vite's `import.meta.env` and is bundled into client-side JS. This is fine for a demo/personal project, but for a production deployment you should proxy requests through a backend so the key is never exposed to the browser.
- Recent locations (up to 5) and your unit preference are persisted in `localStorage`.
- Unit conversion is done client-side from the API's dual-unit response fields, so toggling units never triggers a re-fetch.
