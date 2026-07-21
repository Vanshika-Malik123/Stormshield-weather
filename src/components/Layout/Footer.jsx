import { WiCloud } from 'react-icons/wi'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner glass">
        <div className="footer__brand">
          <WiCloud className="footer__icon" />
          <span>StormShield</span>
        </div>
        <p className="footer__text">
          Weather data and geocoding for every city and country worldwide, courtesy of{' '}
          <a href="https://open-meteo.com" target="_blank" rel="noreferrer">
            Open-Meteo
          </a>
          .
        </p>
        <p className="footer__meta mono">Built with React · Vite · Framer Motion</p>
      </div>
    </footer>
  )
}
