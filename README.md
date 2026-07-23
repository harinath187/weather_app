# 🌦️ Weather App

A responsive weather app built with **React (Vite)** and [WeatherAPI.com](https://www.weatherapi.com/), featuring city search with autocomplete, geolocation, current conditions, hourly and 7-day forecasts, and Celsius/Fahrenheit unit toggling.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38BDF8?logo=tailwindcss&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-ready-2496ED?logo=docker&logoColor=white)

---

## ✨ Features

- 🔍 City search with autocomplete
- 📍 Geolocation-based weather lookup
- 🌡️ Current conditions, hourly, and 7-day forecasts
- 🔁 Celsius / Fahrenheit unit toggle (no re-fetch on toggle)
- 🕘 Recent locations, persisted in `localStorage`

## 🧰 Tech stack

| Layer      | Tools                                          |
| ---------- | ----------------------------------------------- |
| UI         | React 19, Tailwind CSS 4                        |
| Build      | Vite 8                                          |
| Lint       | oxlint                                          |
| Data       | [WeatherAPI.com](https://www.weatherapi.com/)   |
| Deployment | Docker + nginx                                  |

---

## 🚀 Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure your API key

Get a free API key from [weatherapi.com](https://www.weatherapi.com/), then create a `.env` file:

```bash
cp .env.example .env
```

Edit `.env`:

```env
VITE_WEATHERAPI_KEY=your_actual_key_here
```

### 3. Run the dev server

```bash
npm run dev
```

---

## 📦 Available scripts

| Command            | Description                           |
| ------------------- | -------------------------------------- |
| `npm run dev`      | Start the Vite dev server             |
| `npm run build`    | Build the production bundle           |
| `npm run preview`  | Preview the production build locally  |
| `npm run lint`     | Lint the codebase with oxlint          |

---

## 🐳 Docker

Build and run the app in a production-ready nginx container:

```bash
docker build -t weather-app .
docker run -p 8080:80 weather-app
```

Then open [http://localhost:8080](http://localhost:8080).

---

## 📁 Project structure

```text
src/
├── components/   UI components (SearchBar, CurrentWeather, HourlyForecast, DailyForecast, UnitToggle, state views)
├── hooks/        useWeather, useGeolocation, useDebounce, useLocalStorage
├── services/     weatherApi.js — all WeatherAPI.com calls in one place
├── context/      UnitContext (°C/°F, persisted) and LocationContext (recent searches, persisted)
└── utils/        Formatting helpers (temperature/speed/pressure conversion, date/time)
```

---

## 📝 Notes

- The API key is loaded via Vite's `import.meta.env` and is bundled into client-side JS. This is fine for a demo/personal project, but for a production deployment you should proxy requests through a backend so the key is never exposed to the browser.
- Recent locations (up to 5) and your unit preference are persisted in `localStorage`.
- Unit conversion is done client-side from the API's dual-unit response fields, so toggling units never triggers a re-fetch.
