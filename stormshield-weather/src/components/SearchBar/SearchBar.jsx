import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FiSearch, FiMapPin, FiX, FiCrosshair } from 'react-icons/fi'
import { useDebounce } from '../../hooks/useDebounce.js'
import { useGeolocation } from '../../hooks/useGeolocation.js'
import { searchCities, reverseGeocode } from '../../services/weatherService.js'
import { useWeather } from '../../context/WeatherContext.jsx'
import { cityLabel } from '../../utils/formatters.js'
import './SearchBar.css'

export default function SearchBar({ compact = false }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [notice, setNotice] = useState(null)
  const containerRef = useRef(null)

  const debouncedQuery = useDebounce(query, 350)
  const { selectCity, history } = useWeather()
  const { locate, loading: locating } = useGeolocation()

  useEffect(() => {
    let active = true
    async function run() {
      if (debouncedQuery.trim().length < 2) {
        setResults([])
        return
      }
      setLoading(true)
      try {
        const cities = await searchCities(debouncedQuery)
        if (active) setResults(cities)
      } catch {
        if (active) setNotice('Search failed — check your connection and try again.')
      } finally {
        if (active) setLoading(false)
      }
    }
    run()
    return () => {
      active = false
    }
  }, [debouncedQuery])

  useEffect(() => {
    function onClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  function handleSelect(city) {
    selectCity({
      name: city.name,
      country: city.country,
      country_code: city.country_code,
      admin1: city.admin1,
      latitude: city.latitude,
      longitude: city.longitude,
      timezone: city.timezone,
    })
    setQuery('')
    setResults([])
    setIsOpen(false)
  }

  async function handleUseLocation() {
    try {
      setNotice(null)
      const { latitude, longitude } = await locate()
      const place = await reverseGeocode(latitude, longitude)
      handleSelect(
        place
          ? { ...place, latitude, longitude }
          : { name: 'My location', country: '', latitude, longitude, timezone: 'auto' }
      )
    } catch {
      setNotice('Could not access your location. Check browser permissions.')
    }
  }

  const showDropdown = isOpen && (query.trim().length >= 2 || history.length > 0)

  return (
    <div className={`searchbar ${compact ? 'searchbar--compact' : ''}`} ref={containerRef}>
      <div className="searchbar__field glass">
        <FiSearch className="searchbar__icon" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder="Search any city or country worldwide..."
          aria-label="Search for a city"
        />
        {query && (
          <button type="button" className="searchbar__clear" onClick={() => setQuery('')} aria-label="Clear search">
            <FiX />
          </button>
        )}
        <button
          type="button"
          className="searchbar__locate"
          onClick={handleUseLocation}
          aria-label="Use my current location"
          title="Use my current location"
        >
          <FiCrosshair className={locating ? 'spin' : ''} />
        </button>
      </div>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            className="searchbar__dropdown glass"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {loading && <div className="searchbar__status">Searching…</div>}

            {!loading && notice && <div className="searchbar__status searchbar__status--error">{notice}</div>}

            {!loading && query.trim().length >= 2 && results.length === 0 && !notice && (
              <div className="searchbar__status">No cities matched "{query}".</div>
            )}

            {!loading &&
              results.map((city) => (
                <button
                  key={`${city.id}-${city.latitude}`}
                  type="button"
                  className="searchbar__result"
                  onClick={() => handleSelect(city)}
                >
                  <FiMapPin />
                  <span>{cityLabel(city)}</span>
                </button>
              ))}

            {query.trim().length < 2 && history.length > 0 && (
              <>
                <div className="searchbar__section-label">Recent</div>
                {history.map((city) => (
                  <button
                    key={`${city.name}-${city.latitude}`}
                    type="button"
                    className="searchbar__result"
                    onClick={() => handleSelect(city)}
                  >
                    <FiMapPin />
                    <span>{cityLabel(city)}</span>
                  </button>
                ))}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
