import { motion } from 'framer-motion'
import {
  WiDaySunny,
  WiNightClear,
  WiDayCloudyHigh,
  WiNightAltCloudy,
  WiCloud,
  WiFog,
  WiSprinkle,
  WiRain,
  WiRainWind,
  WiSnow,
  WiSnowWind,
  WiThunderstorm,
  WiSleet,
} from 'react-icons/wi'
import './WeatherIcon.css'

const ICONS = {
  clear: { day: WiDaySunny, night: WiNightClear },
  'partly-cloudy': { day: WiDayCloudyHigh, night: WiNightAltCloudy },
  cloudy: { day: WiCloud, night: WiCloud },
  fog: { day: WiFog, night: WiFog },
  drizzle: { day: WiSprinkle, night: WiSprinkle },
  sleet: { day: WiSleet, night: WiSleet },
  rain: { day: WiRain, night: WiRain },
  'rain-heavy': { day: WiRainWind, night: WiRainWind },
  snow: { day: WiSnow, night: WiSnow },
  'snow-heavy': { day: WiSnowWind, night: WiSnowWind },
  storm: { day: WiThunderstorm, night: WiThunderstorm },
}

const FLOAT = {
  animate: { y: [0, -6, 0] },
  transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
}

export default function WeatherIcon({ iconKey = 'clear', isDay = 1, size = 56, className = '' }) {
  const set = ICONS[iconKey] ?? ICONS.clear
  const Icon = isDay ? set.day : set.night

  return (
    <motion.span
      className={`weather-icon ${className}`}
      style={{ fontSize: size }}
      animate={FLOAT.animate}
      transition={FLOAT.transition}
      aria-hidden="true"
    >
      <Icon />
    </motion.span>
  )
}
