import { motion } from 'framer-motion'
import FavoriteCities from '../../components/FavoriteCities/FavoriteCities.jsx'
import { useWeather } from '../../context/WeatherContext.jsx'
import './Favorites.css'

export default function Favorites() {
  const { favorites } = useWeather()

  return (
    <div className="page-shell favorites-page">
      <motion.header
        className="favorites-page__header"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1>Favorite cities</h1>
        <p>
          {favorites.length > 0
            ? `Quick access to ${favorites.length} saved ${favorites.length === 1 ? 'city' : 'cities'}.`
            : 'Cities you save show up here for one-tap access.'}
        </p>
      </motion.header>

      <FavoriteCities />
    </div>
  )
}
