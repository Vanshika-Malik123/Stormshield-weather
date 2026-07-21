import { motion } from 'framer-motion'
import { FiSun, FiMoon, FiTrash2 } from 'react-icons/fi'
import { useWeather } from '../../context/WeatherContext.jsx'
import { useTheme } from '../../context/ThemeContext.jsx'
import { useLocalStorage } from '../../hooks/useLocalStorage.js'
import { STORAGE_KEYS } from '../../utils/constants.js'
import './Settings.css'

export default function Settings() {
  const { unit, setUnit } = useWeather()
  const { theme, setTheme } = useTheme()
  const [, setFavorites] = useLocalStorage(STORAGE_KEYS.FAVORITES, [])
  const [, setHistory] = useLocalStorage(STORAGE_KEYS.HISTORY, [])

  return (
    <div className="page-shell settings-page">
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1>Settings</h1>
        <p>Personalize units, appearance, and stored data.</p>
      </motion.header>

      <section className="settings-section glass">
        <div className="settings-row">
          <div>
            <h2>Temperature unit</h2>
            <p>Choose how temperatures are displayed across the app.</p>
          </div>
          <div className="settings-toggle-group" role="group" aria-label="Temperature unit">
            <button
              type="button"
              className={unit === 'C' ? 'is-active' : ''}
              onClick={() => setUnit('C')}
            >
              Celsius
            </button>
            <button
              type="button"
              className={unit === 'F' ? 'is-active' : ''}
              onClick={() => setUnit('F')}
            >
              Fahrenheit
            </button>
          </div>
        </div>

        <div className="settings-row">
          <div>
            <h2>Appearance</h2>
            <p>Switch between a light and dark glass theme.</p>
          </div>
          <div className="settings-toggle-group" role="group" aria-label="Theme">
            <button type="button" className={theme === 'dark' ? 'is-active' : ''} onClick={() => setTheme('dark')}>
              <FiMoon /> Dark
            </button>
            <button type="button" className={theme === 'light' ? 'is-active' : ''} onClick={() => setTheme('light')}>
              <FiSun /> Light
            </button>
          </div>
        </div>

        <div className="settings-row">
          <div>
            <h2>Stored data</h2>
            <p>Favorites and search history are saved locally in this browser.</p>
          </div>
          <div className="settings-toggle-group">
            <button type="button" onClick={() => setFavorites([])}>
              <FiTrash2 /> Clear favorites
            </button>
            <button type="button" onClick={() => setHistory([])}>
              <FiTrash2 /> Clear history
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
