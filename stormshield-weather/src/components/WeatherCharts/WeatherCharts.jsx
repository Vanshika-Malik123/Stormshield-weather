import { motion } from 'framer-motion'
import TemperatureWaveChart from './TemperatureWaveChart.jsx'
import MetricsRadarChart from './MetricsRadarChart.jsx'
import './WeatherCharts.css'

export default function WeatherCharts() {
  return (
    <motion.section
      className="weather-charts"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="weather-charts__panel glass">
        <h2 className="weather-charts__title">Temperature wave — next 24h</h2>
        <TemperatureWaveChart />
      </div>

      <div className="weather-charts__panel glass">
        <h2 className="weather-charts__title">Conditions radar</h2>
        <MetricsRadarChart />
      </div>
    </motion.section>
  )
}
