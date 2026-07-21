import { motion } from 'framer-motion'
import { FiWind } from 'react-icons/fi'
import { WiUmbrella } from 'react-icons/wi'
import './WearAdvisor.css'

/**
 * Builds a short, human suggestion from data already in the forecast
 * bundle — temp, "feels like", wind, and the next few hours of
 * precipitation probability — so it costs zero extra network calls.
 */
function buildAdvice({ tempC, feelsLikeC, windKmh, rainSoonChance, uvMax }) {
  const parts = []

  if (feelsLikeC == null) return 'Check back once the forecast loads.'

  if (feelsLikeC <= 0) parts.push('Bundle up — heavy coat, gloves, and a hat')
  else if (feelsLikeC <= 8) parts.push('A warm coat or heavy jacket')
  else if (feelsLikeC <= 15) parts.push('A light jacket or sweater')
  else if (feelsLikeC <= 23) parts.push('Comfortable in a t-shirt, maybe a light layer for later')
  else if (feelsLikeC <= 29) parts.push('Light, breathable clothing')
  else parts.push('Stay light and hydrated — it\'s hot out there')

  if (windKmh >= 30) parts.push('something windproof, it\'s gusty')

  let sentence = parts.join(' — ')

  const extras = []
  if (rainSoonChance != null && rainSoonChance >= 40) {
    extras.push(`might want an umbrella${rainSoonChance >= 70 ? '' : ' later'}`)
  }
  if (uvMax != null && uvMax >= 6) {
    extras.push('sunscreen if you\'re out midday')
  }
  if (extras.length) sentence += `. ${extras.join(', ')}.`
  else sentence += '.'

  return sentence.charAt(0).toUpperCase() + sentence.slice(1)
}

export default function WearAdvisor({ tempC, feelsLikeC, windKmh, rainSoonChance, uvMax }) {
  const advice = buildAdvice({ tempC, feelsLikeC, windKmh, rainSoonChance, uvMax })
  const showsRain = rainSoonChance != null && rainSoonChance >= 40

  return (
    <motion.div
      className="wear-advisor glass"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <span className="wear-advisor__icon">
        {showsRain ? <WiUmbrella /> : <FiWind />}
      </span>
      <div>
        <p className="wear-advisor__label">What to wear</p>
        <p className="wear-advisor__text">{advice}</p>
      </div>
    </motion.div>
  )
}
