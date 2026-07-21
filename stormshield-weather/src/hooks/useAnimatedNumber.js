import { useEffect, useRef, useState } from 'react'
import { animate } from 'framer-motion'

/**
 * Smoothly counts from the previous value to the next whenever `value`
 * changes (e.g. on first load, or when switching cities/units), instead
 * of the number just popping in. Returns the rounded, currently-animated
 * number — pass `decimals` for finer precision.
 */
export function useAnimatedNumber(value, { decimals = 0, duration = 0.9 } = {}) {
  const [display, setDisplay] = useState(value ?? 0)
  const prevRef = useRef(value ?? 0)

  useEffect(() => {
    if (value == null || Number.isNaN(value)) return undefined

    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

    if (reduceMotion) {
      setDisplay(value)
      prevRef.current = value
      return undefined
    }

    const controls = animate(prevRef.current, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(v),
      onComplete: () => {
        prevRef.current = value
      },
    })

    return () => controls.stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  const factor = 10 ** decimals
  return Math.round(display * factor) / factor
}
