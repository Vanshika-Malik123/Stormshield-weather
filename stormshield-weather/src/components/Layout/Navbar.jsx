import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { WiCloud } from 'react-icons/wi'
import { FiSun, FiMoon } from 'react-icons/fi'
import SearchBar from '../SearchBar/SearchBar.jsx'
import { useTheme } from '../../context/ThemeContext.jsx'
import './Navbar.css'

export default function Navbar() {
  const { theme, toggleTheme } = useTheme()

  return (
    <motion.header
      className="navbar glass"
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <NavLink to="/" className="navbar__brand">
        <WiCloud className="navbar__brand-icon" />
        <span>StormShield</span>
      </NavLink>

      <div className="navbar__search">
        <SearchBar compact />
      </div>

      <nav className="navbar__links" aria-label="Primary">
        <NavLink to="/" end className={({ isActive }) => (isActive ? 'is-active' : '')}>
          Home
        </NavLink>
        <NavLink to="/favorites" className={({ isActive }) => (isActive ? 'is-active' : '')}>
          Favorites
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => (isActive ? 'is-active' : '')}>
          Settings
        </NavLink>
      </nav>

      <button
        type="button"
        className="navbar__theme-toggle"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      >
        {theme === 'dark' ? <FiSun /> : <FiMoon />}
      </button>
    </motion.header>
  )
}
