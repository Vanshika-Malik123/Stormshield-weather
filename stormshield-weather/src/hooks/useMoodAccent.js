import { useEffect } from 'react'
import { getWeatherInfo } from '../utils/weatherCodes.js'

// One accent pair per sky mood, tuned to sit on top of that mood's
// background gradient (see AnimatedBackground's GRADIENTS) without
// disappearing into it. Night variants lean brighter/cooler so they
// still pop against the near-black night gradients.
const MOOD_ACCENTS = {
  clear: {
    day: ['#F5A15C', '#FFC98B'],
    night: ['#7C6FF0', '#A79BFF'],
  },
  cloudy: {
    day: ['#57C2E8', '#8FD8F2'],
    night: ['#8FA6C2', '#C9D6E6'],
  },
  fog: {
    day: ['#8B97A8', '#B7C0CC'],
    night: ['#9AA6BC', '#C7CFDE'],
  },
  rain: {
    day: ['#57C2E8', '#7FD1E8'],
    night: ['#5C8FD6', '#93B7EA'],
  },
  snow: {
    day: ['#7FC2E8', '#CFE4F6'],
    night: ['#9AC4E8', '#D6E9F8'],
  },
  storm: {
    day: ['#B15CE0', '#D6A9F5'],
    night: ['#B15CE0', '#D6A9F5'],
  },
}

/**
 * Applies a weather-reactive accent color to :root so that buttons,
 * the active nav underline, and highlight icons all pull from the
 * same palette as the animated sky background, instead of a fixed
 * violet/cyan regardless of conditions.
 */
export function useMoodAccent(weatherCode, isDay = 1) {
  useEffect(() => {
    const mood = getWeatherInfo(weatherCode).mood
    const pair = MOOD_ACCENTS[mood]?.[isDay ? 'day' : 'night'] ?? MOOD_ACCENTS.clear.day
    const root = document.documentElement
    root.style.setProperty('--mood-accent', pair[0])
    root.style.setProperty('--mood-accent-soft', pair[1])
  }, [weatherCode, isDay])
}
