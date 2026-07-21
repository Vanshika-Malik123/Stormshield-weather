import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { WiCloudRefresh } from 'react-icons/wi'
import './NotFound.css'

export default function NotFound() {
  return (
    <div className="page-shell not-found">
      <motion.div
        className="not-found__card glass"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <WiCloudRefresh className="not-found__icon" />
        <h1>404</h1>
        <p>This forecast doesn't exist. The page you're looking for has drifted off the map.</p>
        <Link to="/" className="not-found__link">
          Back to StormShield
        </Link>
      </motion.div>
    </div>
  )
}
