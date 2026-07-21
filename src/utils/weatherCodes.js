/**
 * WMO Weather interpretation codes (used by Open-Meteo).
 * Each entry maps a code to a label, an icon key, and a background
 * "mood" used by the AnimatedBackground component.
 */
export const WEATHER_CODES = {
  0: { label: 'Clear sky', icon: 'clear', mood: 'clear' },
  1: { label: 'Mostly clear', icon: 'partly-cloudy', mood: 'clear' },
  2: { label: 'Partly cloudy', icon: 'partly-cloudy', mood: 'cloudy' },
  3: { label: 'Overcast', icon: 'cloudy', mood: 'cloudy' },
  45: { label: 'Fog', icon: 'fog', mood: 'fog' },
  48: { label: 'Depositing rime fog', icon: 'fog', mood: 'fog' },
  51: { label: 'Light drizzle', icon: 'drizzle', mood: 'rain' },
  53: { label: 'Moderate drizzle', icon: 'drizzle', mood: 'rain' },
  55: { label: 'Dense drizzle', icon: 'drizzle', mood: 'rain' },
  56: { label: 'Light freezing drizzle', icon: 'sleet', mood: 'rain' },
  57: { label: 'Dense freezing drizzle', icon: 'sleet', mood: 'rain' },
  61: { label: 'Slight rain', icon: 'rain', mood: 'rain' },
  63: { label: 'Moderate rain', icon: 'rain', mood: 'rain' },
  65: { label: 'Heavy rain', icon: 'rain-heavy', mood: 'storm' },
  66: { label: 'Light freezing rain', icon: 'sleet', mood: 'rain' },
  67: { label: 'Heavy freezing rain', icon: 'sleet', mood: 'storm' },
  71: { label: 'Slight snow fall', icon: 'snow', mood: 'snow' },
  73: { label: 'Moderate snow fall', icon: 'snow', mood: 'snow' },
  75: { label: 'Heavy snow fall', icon: 'snow-heavy', mood: 'snow' },
  77: { label: 'Snow grains', icon: 'snow', mood: 'snow' },
  80: { label: 'Slight rain showers', icon: 'rain', mood: 'rain' },
  81: { label: 'Moderate rain showers', icon: 'rain', mood: 'rain' },
  82: { label: 'Violent rain showers', icon: 'rain-heavy', mood: 'storm' },
  85: { label: 'Slight snow showers', icon: 'snow', mood: 'snow' },
  86: { label: 'Heavy snow showers', icon: 'snow-heavy', mood: 'snow' },
  95: { label: 'Thunderstorm', icon: 'storm', mood: 'storm' },
  96: { label: 'Thunderstorm with hail', icon: 'storm', mood: 'storm' },
  99: { label: 'Thunderstorm with heavy hail', icon: 'storm', mood: 'storm' },
}

export function getWeatherInfo(code) {
  return WEATHER_CODES[code] ?? { label: 'Unknown', icon: 'clear', mood: 'clear' }
}

export const AQI_LEVELS = [
  { max: 50, label: 'Good', color: '#6ED0A0' },
  { max: 100, label: 'Moderate', color: '#F5D76E' },
  { max: 150, label: 'Unhealthy for sensitive groups', color: '#F5A15C' },
  { max: 200, label: 'Unhealthy', color: '#F16A6A' },
  { max: 300, label: 'Very unhealthy', color: '#B15CE0' },
  { max: 500, label: 'Hazardous', color: '#7A2E44' },
]

export function getAqiLevel(aqi) {
  if (aqi == null || Number.isNaN(aqi)) return { label: 'N/A', color: '#8896B3' }
  return AQI_LEVELS.find((l) => aqi <= l.max) ?? AQI_LEVELS[AQI_LEVELS.length - 1]
}
