import { useEffect, useRef } from 'react'
import { getWeatherInfo } from '../../utils/weatherCodes.js'
import './AnimatedBackground.css'

const GRADIENTS = {
  clear: { day: ['#3FA9E0', '#7FD1E8', '#F5D9A8'], night: ['#070B18', '#0B1226', '#1B2A52'] },
  cloudy: { day: ['#5C7495', '#8FA6C2', '#C9D6E6'], night: ['#0A0F1E', '#121B36', '#1E2A47'] },
  fog: { day: ['#8B97A8', '#B7C0CC', '#DCE2E9'], night: ['#0D121F', '#161E32', '#232C42'] },
  rain: { day: ['#33455E', '#4A6285', '#7691AD'], night: ['#060910', '#0C1220', '#141E32'] },
  snow: { day: ['#7C93AE', '#A9BFD6', '#E7EEF6'], night: ['#0B0F1C', '#141C30', '#243149'] },
  storm: { day: ['#232E42', '#38455E', '#556277'], night: ['#040609', '#0A0E17', '#141826'] },
}

/**
 * Signature element: a lightweight canvas sky that reacts to the
 * live weather mood (clear / cloudy / fog / rain / snow / storm) and
 * time of day — drifting clouds, falling rain or snow, twinkling
 * stars, and a slow sun/moon glow, layered under an animated gradient.
 */
export default function AnimatedBackground({ weatherCode, isDay = 1 }) {
  const canvasRef = useRef(null)
  const stateRef = useRef({ particles: [], clouds: [], stars: [] })
  const rafRef = useRef(null)

  const mood = getWeatherInfo(weatherCode).mood

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    function resize() {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      seed()
    }

    function seed() {
      const s = stateRef.current
      const count = mood === 'rain' || mood === 'storm' ? 140 : mood === 'snow' ? 90 : 0
      s.particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        len: mood === 'snow' ? Math.random() * 3 + 2 : Math.random() * 18 + 10,
        speed: mood === 'snow' ? Math.random() * 0.6 + 0.3 : Math.random() * 6 + 8,
        drift: Math.random() * 0.6 - 0.3,
      }))
      s.clouds = Array.from({ length: mood === 'clear' ? 3 : 6 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height * 0.45,
        scale: Math.random() * 0.8 + 0.6,
        speed: Math.random() * 0.15 + 0.05,
        opacity: Math.random() * 0.2 + (isDay ? 0.16 : 0.08),
      }))
      s.stars = Array.from({ length: !isDay ? 90 : 0 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height * 0.6,
        r: Math.random() * 1.4 + 0.3,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        phase: Math.random() * Math.PI * 2,
      }))
    }

    function drawGradient(t) {
      const palette = GRADIENTS[mood]?.[isDay ? 'day' : 'night'] ?? GRADIENTS.clear.day
      const shift = Math.sin(t / 8000) * 40
      const grad = ctx.createLinearGradient(0, 0, width * 0.3 + shift, height)
      grad.addColorStop(0, palette[0])
      grad.addColorStop(0.55, palette[1])
      grad.addColorStop(1, palette[2])
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, width, height)
    }

    function drawSunGlow(t) {
      if (mood !== 'clear' && mood !== 'cloudy') return
      const cx = width * 0.78
      const cy = isDay ? height * 0.22 : height * 0.18
      const pulse = 1 + Math.sin(t / 1500) * 0.04
      const radius = (isDay ? 160 : 90) * pulse
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 3)
      const color = isDay ? 'rgba(255, 224, 168, OPACITY)' : 'rgba(210, 216, 255, OPACITY)'
      glow.addColorStop(0, color.replace('OPACITY', '0.55'))
      glow.addColorStop(0.4, color.replace('OPACITY', '0.18'))
      glow.addColorStop(1, color.replace('OPACITY', '0'))
      ctx.fillStyle = glow
      ctx.fillRect(0, 0, width, height)
    }

    function drawStars(t) {
      stateRef.current.stars.forEach((s) => {
        const alpha = 0.4 + Math.sin(t * s.twinkleSpeed + s.phase) * 0.4
        ctx.beginPath()
        ctx.fillStyle = `rgba(244, 248, 255, ${Math.max(alpha, 0)})`
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fill()
      })
    }

    function drawClouds(t) {
      stateRef.current.clouds.forEach((c) => {
        c.x += c.speed
        if (c.x - 140 * c.scale > width) c.x = -140 * c.scale
        ctx.save()
        ctx.globalAlpha = c.opacity
        ctx.fillStyle = isDay ? '#FFFFFF' : '#AEB9D6'
        const puffs = [
          [0, 0, 34],
          [30, -10, 26],
          [-30, -6, 24],
          [58, 4, 22],
          [-56, 6, 20],
        ]
        puffs.forEach(([dx, dy, r]) => {
          ctx.beginPath()
          ctx.arc(c.x + dx * c.scale, c.y + dy * c.scale, r * c.scale, 0, Math.PI * 2)
          ctx.fill()
        })
        ctx.restore()
      })
    }

    function drawPrecipitation() {
      const s = stateRef.current
      s.particles.forEach((p) => {
        if (mood === 'snow') {
          p.y += p.speed
          p.x += p.drift
          if (p.y > height) { p.y = -5; p.x = Math.random() * width }
          ctx.beginPath()
          ctx.fillStyle = 'rgba(255,255,255,0.85)'
          ctx.arc(p.x, p.y, p.len, 0, Math.PI * 2)
          ctx.fill()
        } else {
          p.y += p.speed
          p.x += p.drift
          if (p.y > height) { p.y = -20; p.x = Math.random() * width }
          ctx.beginPath()
          ctx.strokeStyle = 'rgba(210, 226, 255, 0.5)'
          ctx.lineWidth = 1.4
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(p.x - p.drift * 4, p.y + p.len)
          ctx.stroke()
        }
      })
    }

    function frame(t) {
      ctx.clearRect(0, 0, width, height)
      drawGradient(t)
      drawSunGlow(t)
      if (!isDay) drawStars(t)
      drawClouds(t)
      drawPrecipitation()
      rafRef.current = requestAnimationFrame(frame)
    }

    resize()
    window.addEventListener('resize', resize)
    rafRef.current = requestAnimationFrame(frame)

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) {
      drawGradient(0)
      drawSunGlow(0)
      cancelAnimationFrame(rafRef.current)
    }

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(rafRef.current)
    }
  }, [mood, isDay])

  return (
    <div className="animated-background" aria-hidden="true">
      <canvas ref={canvasRef} className="animated-background__canvas" />
      <div className="animated-background__vignette" />
    </div>
  )
}
