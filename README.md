# 🌦️ Weather App

A responsive weather app built with **React (Vite)** and [Open-Meteo](https://open-meteo.com/) (free, no API key required), featuring city search with autocomplete, geolocation, current conditions, hourly and 7-day forecasts, and Celsius/Fahrenheit unit toggling.

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
| Data       | [Open-Meteo](https://open-meteo.com/) (forecast + geocoding, free/keyless) |
| Deployment | Docker + nginx                                  |

---

## 🚀 Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Run the dev server

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
├── services/     weatherApi.js — all Open-Meteo calls in one place
├── context/      UnitContext (°C/°F, persisted) and LocationContext (recent searches, persisted)
└── utils/        Formatting helpers (temperature/speed/pressure conversion, date/time)
```

---

## 📝 Notes

- No API key or `.env` file is needed — Open-Meteo's forecast and geocoding APIs are free and keyless. Geolocation-based lookups are reverse-geocoded via [BigDataCloud's](https://www.bigdatacloud.com/) free client-side API.
- Recent locations (up to 5) and your unit preference are persisted in `localStorage`.
- Unit conversion is done client-side from the API's dual-unit response fields, so toggling units never triggers a re-fetch.
