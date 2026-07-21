<div align="center">

# 🌩️ StormShield

### A premium, real-time weather forecast dashboard

Search any city on Earth and get live conditions, hourly & 7-day forecasts, air quality, sun data, and more — wrapped in a glassmorphic UI with an animated sky that reacts to real weather.

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Open-Meteo](https://img.shields.io/badge/Open--Meteo-No%20API%20Key-2E7D32)](https://open-meteo.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](#license)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](#contributing)

[Live Demo]  (stormshield-weather.vercel.app)

</div>

---

## 📖 Table of Contents

- [About the Project](#-about-the-project)
- [Screenshots](#-screenshots)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Available Scripts](#-available-scripts)
- [Deployment](#-deployment)
- [API Reference](#-api-reference)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)
- [Author](#-author)

---

## 📌 About the Project

**StormShield** is a full-featured weather forecasting web app built to demonstrate real-world front-end engineering: API integration, state management, data visualization, responsive design, and polished UI/UX — all without relying on a paid weather API key.

It was built as part of an internship project to showcase practical skills in **React, component architecture, custom hooks, charting, and animation**, going beyond a basic "fetch and display" weather app.

---

## 🖼️ Screenshots

> Add your own screenshots/GIFs here once deployed — this section sells the project at a glance.

| Home (Light) | Home (Dark) | Hourly & Charts |
|---|---|---|
| ![screenshot-1](docs/screenshot-home-light.png) | ![screenshot-2](docs/screenshot-home-dark.png) | ![screenshot-3](docs/screenshot-charts.png) |

---

## ✨ Features

- 🌍 **Global city search** — powered by the Open-Meteo Geocoding API, covering every city and country worldwide (not a hardcoded list), with debounced autosuggestions.
- 📍 **Current location weather** via the browser Geolocation API + reverse geocoding.
- 🌡️ **Current conditions** — temperature, feels-like, humidity, pressure, visibility, wind (speed/direction/gusts), UV index, air quality (US AQI + pollutants), sunrise & sunset.
- ⏱️ **24-hour hourly forecast** and **7-day daily forecast** with precipitation probability.
- 📊 **Live data visualizations** — a 24-hour animated temperature "wave" (area chart) and a 6-axis conditions radar chart (humidity, wind, UV, rain chance, air quality, cloud cover), built with Recharts.
- ⭐ **Favorites & history** — save favorite cities and recent searches, persisted to `localStorage`.
- 🌓 **Dark / light glassmorphic theme** toggle.
- 🌡️ **Celsius / Fahrenheit** unit toggle.
- 🎨 **Canvas-based animated sky background** — drifting clouds, rain, snow, stars, and sun glow that change with live weather and time of day.
- 💀 **Loading skeletons**, graceful error states with retry, and a custom 404 page.
- 📱 **Fully responsive** — desktop, tablet, and mobile.

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| Framework | React 18 + Vite 5 |
| Routing | React Router DOM |
| HTTP client | Axios (typed service layer) |
| Animation | Framer Motion |
| Charts | Recharts |
| Icons | React Icons (Weather Icons + Feather) |
| Styling | Plain CSS with shared design tokens (no Tailwind) |
| Weather data | [Open-Meteo](https://open-meteo.com) — Forecast, Geocoding & Air Quality APIs (free, no API key) |

---

## 📂 Project Structure

```
stormshield-weather/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── Layout/              # Navbar, Footer
│   │   ├── SearchBar/           # Global city search + autosuggest
│   │   ├── WeatherIcon/         # Animated icon per weather code
│   │   ├── AnimatedBackground/  # Canvas sky (signature visual)
│   │   ├── CurrentWeatherCard/
│   │   ├── WeatherHighlights/   # Humidity, wind, pressure, visibility,
│   │   │                          UV, AQI, sunrise, sunset cards
│   │   ├── HighlightCard/       # Reusable stat card
│   │   ├── HourlyForecast/
│   │   ├── DailyForecast/
│   │   ├── FavoriteCities/
│   │   ├── LoadingSkeleton/
│   │   └── ErrorMessage/
│   ├── pages/
│   │   ├── Home/
│   │   ├── Favorites/
│   │   ├── Settings/
│   │   └── NotFound/
│   ├── context/                 # ThemeContext, WeatherContext
│   ├── hooks/                   # useWeather, useGeolocation, useDebounce, useLocalStorage
│   ├── services/                # api.js, weatherService.js
│   ├── utils/                   # weatherCodes.js, formatters.js, constants.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
├── vite.config.js
├── .env.example
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) v18 or higher
- npm (comes with Node.js)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/stormshield-weather.git

# 2. Move into the project directory
cd stormshield-weather

# 3. Install dependencies
npm install

# 4. Start the dev server
npm run dev
```

The app will be running at **http://localhost:5173**

---

## 🔐 Environment Variables

Open-Meteo requires **no API key**. `.env.example` only lets you override the base URLs (e.g. if you proxy the API):

```bash
cp .env.example .env
```

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build for production into `/dist` |
| `npm run preview` | Preview the production build locally |

---

## ☁️ Deployment

### Deploy on Vercel

1. Push this project to a GitHub repository.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. Framework preset: **Vite** · Build command: `npm run build` · Output directory: `dist`.
4. No environment variables required. Add the ones from `.env.example` only if proxying requests.
5. Click **Deploy** 🎉

### Deploy via CLI

```bash
npm install -g vercel
vercel
```

---

## 🌐 API Reference

| Purpose | Endpoint |
|---|---|
| City search (any city/country) | `https://geocoding-api.open-meteo.com/v1/search` |
| Reverse geocoding (current location) | `https://geocoding-api.open-meteo.com/v1/reverse` |
| Forecast (current / hourly / daily) | `https://api.open-meteo.com/v1/forecast` |
| Air quality | `https://air-quality-api.open-meteo.com/v1/air-quality` |

---

## 🗺️ Roadmap

- [ ] Add weather alerts / severe weather warnings
- [ ] Add multi-language support (i18n)
- [ ] Add PWA support for offline access
- [ ] Add unit/integration tests (Vitest + React Testing Library)
- [ ] Add historical weather comparison charts

See [open issues](#) for a full list of proposed features and known issues.

---

## 🤝 Contributing

Contributions make the open-source community a great place to learn and build. Any contributions are **greatly appreciated**.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

## 👤 Author

**[vanshika Malik]**
Internship Project 

- GitHub: [Vanshika-Malik123](https://github.com/Vanshika-Malik123)
- Email: vanshikamalik0918@gmail.com

---

<div align="center">

If you found this project useful, consider giving it a ⭐ on GitHub!

</div>
