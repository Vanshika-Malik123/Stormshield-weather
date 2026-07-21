import { motion } from 'framer-motion'
import './HighlightCard.css'

export default function HighlightCard({ icon, label, value, sub, accent, children }) {
  return (
    <motion.div
      className="highlight-card glass"
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <div className="highlight-card__head">
        <span className="highlight-card__icon" style={accent ? { color: accent } : undefined}>
          {icon}
        </span>
        <span className="highlight-card__label">{label}</span>
      </div>
      {value !== '' && <div className="highlight-card__value">{value}</div>}
      {sub && <div className="highlight-card__sub">{sub}</div>}
      {children}
    </motion.div>
  )
}
