import { motion } from 'framer-motion'
import { FiHeart, FiMapPin } from 'react-icons/fi'
import WeatherIcon from '../WeatherIcon/WeatherIcon.jsx'
import { useWeather } from '../../context/WeatherContext.jsx'
import { useAnimatedNumber } from '../../hooks/useAnimatedNumber.js'
import { getWeatherInfo } from '../../utils/weatherCodes.js'
import { convertTemp, formatFullDate, formatTemp, cityLabel } from '../../utils/formatters.js'
import './CurrentWeatherCard.css'

export default function CurrentWeatherCard() {
  const { activeCity, current, unit, toggleFavorite, isFavorite } = useWeather()

  const info = getWeatherInfo(current?.weather_code)
  const temp = convertTemp(current?.temperature_2m, unit)
  const feelsLike = convertTemp(current?.apparent_temperature, unit)
  const favorited = isFavorite(activeCity)
  const animatedTemp = useAnimatedNumber(temp)

  if (!current) return null

  return (
    <motion.section
      className="current-card glass"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="current-card__top">
        <div className="current-card__location">
          <FiMapPin />
          <div>
            <h1>{activeCity?.name}</h1>
            <p>{cityLabel(activeCity)}</p>
          </div>
        </div>
        <button
          type="button"
          className={`current-card__fav ${favorited ? 'is-active' : ''}`}
          onClick={() => toggleFavorite(activeCity)}
          aria-pressed={favorited}
          aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
        >
          <FiHeart />
        </button>
      </div>

      <p className="current-card__date mono">{formatFullDate(new Date().toISOString(), current.timezone)}</p>

      <div className="current-card__main">
        <WeatherIcon iconKey={info.icon} isDay={current.is_day} size={112} />
        <div className="current-card__temp">
          <span className="current-card__temp-value">{formatTemp(animatedTemp, unit)}</span>
          <span className="current-card__temp-label">{info.label}</span>
          <span className="current-card__feels mono">Feels like {formatTemp(feelsLike, unit)}</span>
        </div>
      </div>
    </motion.section>
  )
}
