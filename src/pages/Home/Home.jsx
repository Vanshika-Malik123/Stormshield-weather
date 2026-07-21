import { motion } from 'framer-motion'
import CurrentWeatherCard from '../../components/CurrentWeatherCard/CurrentWeatherCard.jsx'
import WeatherHighlights from '../../components/WeatherHighlights/WeatherHighlights.jsx'
import WeatherCharts from '../../components/WeatherCharts/WeatherCharts.jsx'
import HourlyForecast from '../../components/HourlyForecast/HourlyForecast.jsx'
import DailyForecast from '../../components/DailyForecast/DailyForecast.jsx'
import FavoriteCities from '../../components/FavoriteCities/FavoriteCities.jsx'
import LoadingSkeleton from '../../components/LoadingSkeleton/LoadingSkeleton.jsx'
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage.jsx'
import SearchBar from '../../components/SearchBar/SearchBar.jsx'
import SunPathArc from '../../components/SunPathArc/SunPathArc.jsx'
import WearAdvisor from '../../components/WearAdvisor/WearAdvisor.jsx'
import RadarMap from '../../components/RadarMap/RadarMap.jsx'
import { useWeather } from '../../context/WeatherContext.jsx'
import './Home.css'

export default function Home() {
  const { loading, error, refetch, favorites, activeCity, current, forecast } = useWeather()

  const today = forecast?.daily
  const sunrise = today?.sunrise?.[0]
  const sunset = today?.sunset?.[0]
  const uvMax = today?.uv_index_max?.[0]

  // Match current hour's precipitation probability for the "soon" window
  // the wear advisor uses — reuses hourly data already in the forecast
  // bundle, no extra fetch.
  const nowHourIso = forecast?.current?.time?.slice(0, 13)
  const hourIdx = forecast?.hourly?.time?.findIndex((t) => t.slice(0, 13) === nowHourIso)
  const rainSoonChance =
    hourIdx >= 0 ? forecast?.hourly?.precipitation_probability?.[hourIdx] : null

  return (
    <div className="page-shell home">
      <motion.div
        className="home__hero-search"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <SearchBar />
      </motion.div>

      {loading && <LoadingSkeleton />}

      {!loading && error && <ErrorMessage message={error} onRetry={refetch} />}

      {!loading && !error && (
        <>
          <div className="home__grid">
            <CurrentWeatherCard />
          </div>

          {current && (
            <WearAdvisor
              tempC={current.temperature_2m}
              feelsLikeC={current.apparent_temperature}
              windKmh={current.wind_speed_10m}
              rainSoonChance={rainSoonChance}
              uvMax={uvMax}
            />
          )}

          <WeatherHighlights />

          <div className="home__secondary-grid">
            <SunPathArc sunrise={sunrise} sunset={sunset} timezone={forecast?.timezone} />
            <RadarMap
              latitude={activeCity?.latitude}
              longitude={activeCity?.longitude}
              cityName={activeCity?.name}
            />
          </div>

          <WeatherCharts />
          <HourlyForecast />
          <DailyForecast />

          {favorites.length > 0 && (
            <section className="home__favorites">
              <h2 className="home__section-title">Favorite cities</h2>
              <FavoriteCities emptyState={false} />
            </section>
          )}
        </>
      )}
    </div>
  )
}
