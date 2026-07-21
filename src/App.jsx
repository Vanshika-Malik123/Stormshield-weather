import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Layout/Navbar.jsx'
import Footer from './components/Layout/Footer.jsx'
import AnimatedBackground from './components/AnimatedBackground/AnimatedBackground.jsx'
import Home from './pages/Home/Home.jsx'
import Favorites from './pages/Favorites/Favorites.jsx'
import Settings from './pages/Settings/Settings.jsx'
import NotFound from './pages/NotFound/NotFound.jsx'
import { useWeather } from './context/WeatherContext.jsx'
import { useMoodAccent } from './hooks/useMoodAccent.js'

function App() {
  const { current } = useWeather()

  useMoodAccent(current?.weather_code, current?.is_day)

  return (
    <>
      <AnimatedBackground
        weatherCode={current?.weather_code}
        isDay={current?.is_day}
      />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}

export default App
