import { useCallback, useEffect, useState } from 'react'
import { fetchWeatherBundle } from '../services/weatherService.js'

/**
 * Loads the forecast + air-quality bundle for whichever city object
 * (name, latitude, longitude, timezone...) is passed in, and re-fetches
 * whenever the coordinates change.
 */
export function useWeather(city) {
  const [forecast, setForecast] = useState(null)
  const [air, setAir] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    if (!city?.latitude || !city?.longitude) return
    setLoading(true)
    setError(null)
    try {
      const bundle = await fetchWeatherBundle(city.latitude, city.longitude)
      if (!bundle.forecast) throw new Error('Weather data is unavailable right now.')
      setForecast(bundle.forecast)
      setAir(bundle.air)
    } catch (err) {
      setError(err?.message || 'Something went wrong while fetching the forecast.')
    } finally {
      setLoading(false)
    }
  }, [city?.latitude, city?.longitude])

  useEffect(() => {
    load()
  }, [load])

  return { forecast, air, loading, error, refetch: load }
}
