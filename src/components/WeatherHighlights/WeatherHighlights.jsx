import { motion } from 'framer-motion'
import { FiDroplet, FiWind, FiEye, FiActivity, FiShield } from 'react-icons/fi'
import { WiBarometer } from 'react-icons/wi'
import HighlightCard from '../HighlightCard/HighlightCard.jsx'
import WindCompass from '../WindCompass/WindCompass.jsx'
import { useWeather } from '../../context/WeatherContext.jsx'
import { getAqiLevel } from '../../utils/weatherCodes.js'
import { formatTime, kmhToMph } from '../../utils/formatters.js'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
}

export default function WeatherHighlights() {
  const { current, forecast, air, unit } = useWeather()
  if (!current || !forecast) return null

  const today = forecast.daily
  const uvIndex = today?.uv_index_max?.[0]

  // Match current hour's visibility from hourly data.
  const nowHourIso = forecast.current?.time?.slice(0, 13)
  const hourIdx = forecast.hourly?.time?.findIndex((t) => t.slice(0, 13) === nowHourIso)
  const visibilityMeters = hourIdx >= 0 ? forecast.hourly?.visibility?.[hourIdx] : null
  const visibilityKm = visibilityMeters != null ? visibilityMeters / 1000 : null

  const windSpeed = unit === 'F' ? kmhToMph(current.wind_speed_10m) : current.wind_speed_10m
  const windUnitLabel = unit === 'F' ? 'mph' : 'km/h'

  const aqi = air?.us_aqi
  const aqiLevel = getAqiLevel(aqi)

  return (
    <motion.section
      className="highlights-grid"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={item}>
        <HighlightCard
          icon={<FiDroplet />}
          label="Humidity"
          value={`${Math.round(current.relative_humidity_2m ?? 0)}%`}
          sub={current.relative_humidity_2m > 60 ? 'Feels humid' : 'Comfortable'}
        />
      </motion.div>

      <motion.div variants={item}>
        <HighlightCard icon={<FiWind />} label="Wind" value="" sub={null}>
          <WindCompass
            direction={current.wind_direction_10m}
            speed={windSpeed}
            unitLabel={windUnitLabel}
          />
          <div className="highlight-card__sub">
            Gusts {Math.round(unit === 'F' ? kmhToMph(current.wind_gusts_10m ?? 0) : current.wind_gusts_10m ?? 0)}{' '}
            {windUnitLabel}
          </div>
        </HighlightCard>
      </motion.div>

      <motion.div variants={item}>
        <HighlightCard
          icon={<WiBarometer />}
          label="Pressure"
          value={`${Math.round(current.surface_pressure ?? current.pressure_msl ?? 0)}`}
          sub="hPa at surface level"
        />
      </motion.div>

      <motion.div variants={item}>
        <HighlightCard
          icon={<FiEye />}
          label="Visibility"
          value={visibilityKm != null ? `${visibilityKm.toFixed(1)} km` : '--'}
          sub={visibilityKm != null && visibilityKm > 10 ? 'Excellent visibility' : 'Reduced visibility'}
        />
      </motion.div>

      <motion.div variants={item}>
        <HighlightCard
          icon={<FiActivity />}
          label="UV Index"
          value={uvIndex != null ? Math.round(uvIndex) : '--'}
          sub={uvIndex >= 8 ? 'Very high — use protection' : uvIndex >= 3 ? 'Moderate' : 'Low'}
        />
      </motion.div>

      <motion.div variants={item}>
        <HighlightCard
          icon={<FiShield />}
          label="Air Quality"
          value={aqi ?? '--'}
          sub={aqiLevel.label}
          accent={aqiLevel.color}
        />
      </motion.div>

    </motion.section>
  )
}
