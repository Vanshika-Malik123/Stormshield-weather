import { motion } from 'framer-motion'
import { FiMapPin, FiX } from 'react-icons/fi'
import { useWeather } from '../../context/WeatherContext.jsx'
import { cityLabel } from '../../utils/formatters.js'
import './FavoriteCities.css'

export default function FavoriteCities({ emptyState = true }) {
  const { favorites, selectCity, toggleFavorite, activeCity } = useWeather()

  if (favorites.length === 0) {
    if (!emptyState) return null
    return (
      <div className="favorites-empty glass">
        <FiMapPin />
        <p>No favorite cities yet. Search for a city and tap the heart icon to save it here.</p>
      </div>
    )
  }

  return (
    <div className="favorites-grid">
      {favorites.map((city, i) => {
        const isActive = activeCity?.name === city.name && activeCity?.latitude === city.latitude
        return (
          <motion.button
            key={`${city.name}-${city.latitude}`}
            type="button"
            className={`favorite-chip glass ${isActive ? 'is-active' : ''}`}
            onClick={() => selectCity(city)}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04, duration: 0.35 }}
            whileHover={{ y: -3 }}
          >
            <span className="favorite-chip__label">
              <FiMapPin />
              {cityLabel(city)}
            </span>
            <span
              className="favorite-chip__remove"
              role="button"
              tabIndex={0}
              aria-label={`Remove ${city.name} from favorites`}
              onClick={(e) => {
                e.stopPropagation()
                toggleFavorite(city)
              }}
            >
              <FiX />
            </span>
          </motion.button>
        )
      })}
    </div>
  )
}
