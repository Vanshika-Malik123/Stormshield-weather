import { motion } from 'framer-motion'
import { windDirectionLabel } from '../../utils/formatters.js'
import './WindCompass.css'

const TICKS = ['N', 'E', 'S', 'W']

export default function WindCompass({ direction, speed, unitLabel }) {
  const deg = direction ?? 0

  return (
    <div className="wind-compass">
      <div className="wind-compass__dial">
        <svg viewBox="0 0 100 100" className="wind-compass__svg" aria-hidden="true">
          <circle cx="50" cy="50" r="46" className="wind-compass__ring" />
          {TICKS.map((label, i) => {
            const angle = i * 90
            const rad = (angle - 90) * (Math.PI / 180)
            const x = 50 + Math.cos(rad) * 38
            const y = 50 + Math.sin(rad) * 38
            return (
              <text key={label} x={x} y={y + 3} className="wind-compass__tick">
                {label}
              </text>
            )
          })}
          <motion.g
            className="wind-compass__needle"
            animate={{ rotate: deg }}
            initial={false}
            transition={{ type: 'spring', stiffness: 60, damping: 12 }}
            style={{ originX: '50px', originY: '50px' }}
          >
            <polygon points="50,12 44,54 50,46 56,54" className="wind-compass__needle-north" />
            <polygon points="50,88 44,54 50,62 56,54" className="wind-compass__needle-south" />
          </motion.g>
          <circle cx="50" cy="50" r="4" className="wind-compass__hub" />
        </svg>
      </div>
      <div className="wind-compass__readout">
        <span className="wind-compass__speed">{Math.round(speed ?? 0)}</span>
        <span className="wind-compass__unit">{unitLabel}</span>
        <span className="wind-compass__dir mono">{windDirectionLabel(direction)}</span>
      </div>
    </div>
  )
}
