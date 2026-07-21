import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage.js'
import { useWeather as useWeatherData } from '../hooks/useWeather.js'
import { useToast } from './ToastContext.jsx'
import { DEFAULT_CITY, MAX_FAVORITES, MAX_HISTORY, STORAGE_KEYS } from '../utils/constants.js'

const WeatherContext = createContext(null)

function cityKey(city) {
  return `${city.latitude?.toFixed(2)},${city.longitude?.toFixed(2)}`
}

export function WeatherProvider({ children }) {
  const [activeCity, setActiveCity] = useLocalStorage(STORAGE_KEYS.LAST_CITY, DEFAULT_CITY)
  const [favorites, setFavorites] = useLocalStorage(STORAGE_KEYS.FAVORITES, [])
  const [history, setHistory] = useLocalStorage(STORAGE_KEYS.HISTORY, [])
  const [unit, setUnit] = useLocalStorage(STORAGE_KEYS.UNIT, 'C')
  const [banner, setBanner] = useState(null)
  const { showToast } = useToast()

  const { forecast, air, loading, error, refetch } = useWeatherData(activeCity)

  const selectCity = useCallback(
    (city) => {
      setActiveCity(city)
      setHistory((prev) => {
        const withoutDup = prev.filter((c) => cityKey(c) !== cityKey(city))
        return [city, ...withoutDup].slice(0, MAX_HISTORY)
      })
      showToast(`Switched to ${city.name}`, { type: 'success' })
    },
    [setActiveCity, setHistory, showToast]
  )

  const toggleFavorite = useCallback(
    (city) => {
      setFavorites((prev) => {
        const exists = prev.some((c) => cityKey(c) === cityKey(city))
        if (exists) {
          showToast(`Removed ${city.name} from favorites`)
          return prev.filter((c) => cityKey(c) !== cityKey(city))
        }
        if (prev.length >= MAX_FAVORITES) {
          showToast(`You can only save up to ${MAX_FAVORITES} favorites`)
          return prev
        }
        showToast(`Added ${city.name} to favorites`, { type: 'success' })
        return [...prev, city]
      })
    },
    [setFavorites, showToast]
  )

  const isFavorite = useCallback(
    (city) => (city ? favorites.some((c) => cityKey(c) === cityKey(city)) : false),
    [favorites]
  )

  const toggleUnit = useCallback(() => {
    setUnit((u) => {
      const next = u === 'C' ? 'F' : 'C'
      showToast(`Switched to °${next}`, { type: 'success' })
      return next
    })
  }, [setUnit, showToast])

  const value = useMemo(
    () => ({
      activeCity,
      selectCity,
      favorites,
      toggleFavorite,
      isFavorite,
      history,
      unit,
      toggleUnit,
      setUnit,
      forecast,
      current: forecast?.current
        ? { ...forecast.current, timezone: forecast.timezone }
        : null,
      air,
      loading,
      error,
      refetch,
      banner,
      setBanner,
    }),
    [
      activeCity,
      selectCity,
      favorites,
      toggleFavorite,
      isFavorite,
      history,
      unit,
      toggleUnit,
      setUnit,
      forecast,
      air,
      loading,
      error,
      refetch,
      banner,
    ]
  )

  return <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>
}

export function useWeather() {
  const ctx = useContext(WeatherContext)
  if (!ctx) throw new Error('useWeather must be used within a WeatherProvider')
  return ctx
}
