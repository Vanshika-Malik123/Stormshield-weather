import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { FiPause, FiPlay } from 'react-icons/fi'
import './RadarMap.css'

const RAINVIEWER_META_URL = 'https://api.rainviewer.com/public/weather-maps.json'
const TILE_SIZE = 256
const ZOOM = 7
const GRID = 3 // renders a 3x3 tile grid centered on the city
const VIEW_SIZE = 320
const FRAME_INTERVAL_MS = 700

// Standard Web Mercator lon/lat -> fractional tile coordinate at a zoom level.
function lonLatToTile(lon, lat, zoom) {
  const x = ((lon + 180) / 360) * 2 ** zoom
  const latRad = (lat * Math.PI) / 180
  const y = ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * 2 ** zoom
  return { x, y }
}

export default function RadarMap({ latitude, longitude, cityName }) {
  const [frames, setFrames] = useState([])
  const [frameIndex, setFrameIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [metaError, setMetaError] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    setMetaError(false)
    fetch(RAINVIEWER_META_URL)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return
        const past = data?.radar?.past ?? []
        const nowcast = data?.radar?.nowcast ?? []
        const all = [...past, ...nowcast]
        setFrames(all)
        setFrameIndex(Math.max(0, past.length - 1))
      })
      .catch(() => {
        if (!cancelled) setMetaError(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!playing || frames.length === 0) return undefined
    timerRef.current = setInterval(() => {
      setFrameIndex((i) => (i + 1) % frames.length)
    }, FRAME_INTERVAL_MS)
    return () => clearInterval(timerRef.current)
  }, [playing, frames.length])

  const half = Math.floor(GRID / 2)

  const geo = useMemo(() => {
    if (latitude == null || longitude == null) return null
    const { x: cx, y: cy } = lonLatToTile(longitude, latitude, ZOOM)
    const tx = Math.floor(cx)
    const ty = Math.floor(cy)
    return {
      tx,
      ty,
      offsetX: (cx - tx) * TILE_SIZE,
      offsetY: (cy - ty) * TILE_SIZE,
    }
  }, [latitude, longitude])

  const tiles = useMemo(() => {
    if (!geo) return []
    const list = []
    for (let dx = -half; dx <= half; dx++) {
      for (let dy = -half; dy <= half; dy++) {
        list.push({ x: geo.tx + dx, y: geo.ty + dy, dx, dy })
      }
    }
    return list
  }, [geo, half])

  const frame = frames[frameIndex]

  // Translate the tile grid so the city's exact fractional position lands
  // in the center of the fixed-size viewport, regardless of tile boundaries.
  const gridTransform = geo
    ? `translate(${VIEW_SIZE / 2 - (half * TILE_SIZE + geo.offsetX)}px, ${
        VIEW_SIZE / 2 - (half * TILE_SIZE + geo.offsetY)
      }px)`
    : 'none'

  return (
    <div className="radar-map glass">
      <div className="radar-map__head">
        <div>
          <p className="radar-map__label">Precipitation radar</p>
          <p className="radar-map__city">{cityName}</p>
        </div>
        {frames.length > 0 && (
          <button
            type="button"
            className="radar-map__play"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? 'Pause radar animation' : 'Play radar animation'}
          >
            {playing ? <FiPause /> : <FiPlay />}
          </button>
        )}
      </div>

      <div className="radar-map__viewport" style={{ width: VIEW_SIZE, height: VIEW_SIZE }}>
        {geo && (
          <div
            className="radar-map__grid"
            style={{ width: GRID * TILE_SIZE, height: GRID * TILE_SIZE, transform: gridTransform }}
          >
            {tiles.map((t) => (
              <div
                key={`${t.x}-${t.y}`}
                className="radar-map__tile"
                style={{ left: (t.dx + half) * TILE_SIZE, top: (t.dy + half) * TILE_SIZE }}
              >
                <img
                  src={`https://tile.openstreetmap.org/${ZOOM}/${t.x}/${t.y}.png`}
                  alt=""
                  className="radar-map__base"
                  loading="lazy"
                />
                {frame && (
                  <img
                    src={`https://tilecache.rainviewer.com${frame.path}/${TILE_SIZE}/${ZOOM}/${t.x}/${t.y}/4/1_1.png`}
                    alt=""
                    className="radar-map__overlay"
                    loading="lazy"
                  />
                )}
              </div>
            ))}
          </div>
        )}
        {geo && <div className="radar-map__center-pin" />}
        {metaError && <div className="radar-map__error">Radar data unavailable right now.</div>}
      </div>

      {frames.length > 0 && (
        <motion.div className="radar-map__scrub" layout>
          <span className="mono radar-map__time">
            {frame
              ? new Date(frame.time * 1000).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
              : '--'}
          </span>
          <input
            type="range"
            min={0}
            max={Math.max(frames.length - 1, 0)}
            value={frameIndex}
            onChange={(e) => setFrameIndex(Number(e.target.value))}
            className="radar-map__slider"
            aria-label="Radar frame"
          />
        </motion.div>
      )}
    </div>
  )
}
