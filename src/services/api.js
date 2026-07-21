import axios from 'axios'

const GEOCODING_API_URL =
  import.meta.env.VITE_GEOCODING_API_URL || 'https://geocoding-api.open-meteo.com/v1/search'
const REVERSE_GEOCODING_API_URL =
  import.meta.env.VITE_REVERSE_GEOCODING_API_URL || 'https://geocoding-api.open-meteo.com/v1/reverse'
const FORECAST_API_URL =
  import.meta.env.VITE_FORECAST_API_URL || 'https://api.open-meteo.com/v1/forecast'
const AIR_QUALITY_API_URL =
  import.meta.env.VITE_AIR_QUALITY_API_URL || 'https://air-quality-api.open-meteo.com/v1/air-quality'

// Three lightweight axios instances — one per Open-Meteo service.
// Every request path is centralized here so no URL is hardcoded
// inside a component.
export const geocodingClient = axios.create({ baseURL: GEOCODING_API_URL, timeout: 10000 })
export const reverseGeocodingClient = axios.create({ baseURL: REVERSE_GEOCODING_API_URL, timeout: 10000 })
export const forecastClient = axios.create({ baseURL: FORECAST_API_URL, timeout: 10000 })
export const airQualityClient = axios.create({ baseURL: AIR_QUALITY_API_URL, timeout: 10000 })
