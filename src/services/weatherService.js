import { geocodingClient, reverseGeocodingClient, forecastClient, airQualityClient } from './api.js'

/**
 * Search for a city by name. Open-Meteo's geocoding database spans
 * every country worldwide, so this single endpoint is what lets the
 * search bar resolve any city on Earth rather than a hardcoded list.
 */
export async function searchCities(query, count = 8) {
  if (!query || query.trim().length < 2) return []
  const { data } = await geocodingClient.get('', {
    params: { name: query.trim(), count, language: 'en', format: 'json' },
  })
  return data?.results ?? []
}

/** Resolve a city name from raw coordinates (used for "current location"). */
export async function reverseGeocode(latitude, longitude) {
  const { data } = await reverseGeocodingClient.get('', {
    params: { latitude, longitude, language: 'en', format: 'json' },
  })
  return data?.results?.[0] ?? null
}

/** Full current + hourly + 7-day forecast for a coordinate pair. */
export async function fetchForecast(latitude, longitude) {
  const { data } = await forecastClient.get('', {
    params: {
      latitude,
      longitude,
      current: [
        'temperature_2m',
        'relative_humidity_2m',
        'apparent_temperature',
        'is_day',
        'precipitation',
        'weather_code',
        'cloud_cover',
        'pressure_msl',
        'surface_pressure',
        'wind_speed_10m',
        'wind_direction_10m',
        'wind_gusts_10m',
      ].join(','),
      hourly: ['temperature_2m', 'weather_code', 'precipitation_probability', 'visibility', 'uv_index'].join(','),
      daily: [
        'weather_code',
        'temperature_2m_max',
        'temperature_2m_min',
        'sunrise',
        'sunset',
        'uv_index_max',
        'precipitation_probability_max',
        'wind_speed_10m_max',
      ].join(','),
      timezone: 'auto',
      forecast_days: 8,
    },
  })
  return data
}

/** Current air quality (US AQI + key pollutants) for a coordinate pair. */
export async function fetchAirQuality(latitude, longitude) {
  const { data } = await airQualityClient.get('', {
    params: {
      latitude,
      longitude,
      current: ['us_aqi', 'pm2_5', 'pm10', 'ozone', 'nitrogen_dioxide'].join(','),
      timezone: 'auto',
    },
  })
  return data?.current ?? null
}

/** Convenience: fetch forecast + air quality together for a city. */
export async function fetchWeatherBundle(latitude, longitude) {
  const [forecast, air] = await Promise.allSettled([
    fetchForecast(latitude, longitude),
    fetchAirQuality(latitude, longitude),
  ])

  return {
    forecast: forecast.status === 'fulfilled' ? forecast.value : null,
    air: air.status === 'fulfilled' ? air.value : null,
  }
}
