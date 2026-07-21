import { motion } from 'framer-motion'
import WeatherIcon from '../WeatherIcon/WeatherIcon.jsx'
import { useWeather } from '../../context/WeatherContext.jsx'
import { getWeatherInfo } from '../../utils/weatherCodes.js'
import { convertTemp, formatHour, formatTemp } from '../../utils/formatters.js'
import './HourlyForecast.css'

export default function HourlyForecast() {
  const { forecast, unit } = useWeather()
  if (!forecast?.hourly) return null

  const nowIso = forecast.current?.time
  const startIndex = Math.max(
    0,
    forecast.hourly.time.findIndex((t) => t >= nowIso)
  )
  const slice = forecast.hourly.time.slice(startIndex, startIndex + 24)

  return (
    <motion.section
      className="hourly glass"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <h2 className="hourly__title">Hourly forecast</h2>
      <div className="hourly__row">
        {slice.map((time, i) => {
          const idx = startIndex + i
          const code = forecast.hourly.weather_code[idx]
          const info = getWeatherInfo(code)
          const temp = convertTemp(forecast.hourly.temperature_2m[idx], unit)
          const pop = forecast.hourly.precipitation_probability?.[idx]
          const isDay = new Date(time).getHours() >= 6 && new Date(time).getHours() < 20 ? 1 : 0

          return (
            <div className="hourly__item" key={time}>
              <span className="hourly__time mono">{i === 0 ? 'Now' : formatHour(time, forecast.timezone)}</span>
              <WeatherIcon iconKey={info.icon} isDay={isDay} size={30} />
              <span className="hourly__temp">{formatTemp(temp, unit)}</span>
              {pop != null && pop > 0 && <span className="hourly__pop mono">{pop}%</span>}
            </div>
          )
        })}
      </div>
    </motion.section>
  )
}
