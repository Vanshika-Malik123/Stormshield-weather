import { motion } from 'framer-motion'
import WeatherIcon from '../WeatherIcon/WeatherIcon.jsx'
import { useWeather } from '../../context/WeatherContext.jsx'
import { getWeatherInfo } from '../../utils/weatherCodes.js'
import { convertTemp, formatDayLabel, formatTemp } from '../../utils/formatters.js'
import './DailyForecast.css'

export default function DailyForecast() {
  const { forecast, unit } = useWeather()
  if (!forecast?.daily) return null

  const days = forecast.daily.time.slice(0, 7)
  const highs = days.map((_, i) => forecast.daily.temperature_2m_max[i])
  const lows = days.map((_, i) => forecast.daily.temperature_2m_min[i])
  const globalMax = Math.max(...highs)
  const globalMin = Math.min(...lows)
  const range = Math.max(globalMax - globalMin, 1)

  return (
    <motion.section
      className="daily glass"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
    >
      <h2 className="daily__title">7-day forecast</h2>
      <ul className="daily__list">
        {days.map((day, i) => {
          const info = getWeatherInfo(forecast.daily.weather_code[i])
          const high = convertTemp(forecast.daily.temperature_2m_max[i], unit)
          const low = convertTemp(forecast.daily.temperature_2m_min[i], unit)
          const barStart = ((lows[i] - globalMin) / range) * 100
          const barWidth = ((highs[i] - lows[i]) / range) * 100
          const pop = forecast.daily.precipitation_probability_max?.[i]

          return (
            <li className="daily__row" key={day}>
              <span className="daily__day">{formatDayLabel(day, i)}</span>
              <div className="daily__icon">
                <WeatherIcon iconKey={info.icon} isDay={1} size={26} />
                {pop != null && pop > 20 && <span className="daily__pop mono">{pop}%</span>}
              </div>
              <span className="daily__low mono">{formatTemp(low, unit)}</span>
              <div className="daily__bar-track">
                <div
                  className="daily__bar-fill"
                  style={{ left: `${barStart}%`, width: `${Math.max(barWidth, 6)}%` }}
                />
              </div>
              <span className="daily__high mono">{formatTemp(high, unit)}</span>
            </li>
          )
        })}
      </ul>
    </motion.section>
  )
}
