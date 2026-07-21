import { motion } from 'framer-motion'
import { FiSunrise, FiSunset } from 'react-icons/fi'
import { formatTime } from '../../utils/formatters.js'
import './SunPathArc.css'

const WIDTH = 320
const HEIGHT = 130
const PAD = 24
const ARC_TOP = 20

// Point on a simple upward parabola between the two ground anchors,
// parameterized 0 (sunrise) -> 1 (sunset).
function pointOnArc(t) {
  const x = PAD + t * (WIDTH - PAD * 2)
  const y = HEIGHT - 10 - Math.sin(t * Math.PI) * (HEIGHT - 10 - ARC_TOP)
  return { x, y }
}

function buildArcPath() {
  const steps = 40
  let d = ''
  for (let i = 0; i <= steps; i++) {
    const { x, y } = pointOnArc(i / steps)
    d += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`
  }
  return d
}

export default function SunPathArc({ sunrise, sunset, timezone }) {
  if (!sunrise || !sunset) return null

  const sunriseMs = new Date(sunrise).getTime()
  const sunsetMs = new Date(sunset).getTime()
  const nowMs = Date.now()

  const dayLength = sunsetMs - sunriseMs
  const rawProgress = dayLength > 0 ? (nowMs - sunriseMs) / dayLength : 0
  const progress = Math.min(Math.max(rawProgress, 0), 1)
  const isBeforeSunrise = nowMs < sunriseMs
  const isAfterSunset = nowMs > sunsetMs
  const isDaylight = !isBeforeSunrise && !isAfterSunset

  const sunPos = pointOnArc(progress)
  const arcPath = buildArcPath()

  return (
    <div className="sun-path glass">
      <div className="sun-path__head">
        <span className="sun-path__label">Sun path</span>
        <span className="sun-path__status">
          {isBeforeSunrise ? 'Not risen yet' : isAfterSunset ? 'Below horizon' : 'Above horizon'}
        </span>
      </div>

      <svg
        className="sun-path__svg"
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <line x1={PAD} y1={HEIGHT - 10} x2={WIDTH - PAD} y2={HEIGHT - 10} className="sun-path__ground" />
        <path d={arcPath} className="sun-path__arc" fill="none" />
        <path
          d={buildArcPathUpTo(progress)}
          className="sun-path__arc-traveled"
          fill="none"
        />
        {isDaylight && (
          <motion.circle
            cx={sunPos.x}
            cy={sunPos.y}
            r={7}
            className="sun-path__marker"
            animate={{ cx: sunPos.x, cy: sunPos.y }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          />
        )}
      </svg>

      <div className="sun-path__times">
        <span>
          <FiSunrise /> {formatTime(sunrise, timezone)}
        </span>
        <span>
          <FiSunset /> {formatTime(sunset, timezone)}
        </span>
      </div>
    </div>
  )
}

function buildArcPathUpTo(t) {
  if (t <= 0) return ''
  const steps = Math.max(2, Math.round(40 * t))
  let d = ''
  for (let i = 0; i <= steps; i++) {
    const { x, y } = pointOnArc((i / steps) * t)
    d += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`
  }
  return d
}
