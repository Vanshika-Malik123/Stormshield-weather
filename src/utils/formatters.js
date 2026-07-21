export function formatTemp(value, unit = 'C') {
  if (value == null || Number.isNaN(value)) return '--'
  return `${Math.round(value)}°${unit}`
}

export function celsiusToFahrenheit(c) {
  return (c * 9) / 5 + 32
}

export function convertTemp(celsiusValue, unit) {
  if (celsiusValue == null) return null
  return unit === 'F' ? celsiusToFahrenheit(celsiusValue) : celsiusValue
}

export function formatTime(isoString, timezone) {
  if (!isoString) return '--'
  try {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: timezone,
    }).format(new Date(isoString))
  } catch {
    return new Date(isoString).toLocaleTimeString()
  }
}

export function formatHour(isoString, timezone) {
  if (!isoString) return '--'
  try {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      hour12: true,
      timeZone: timezone,
    }).format(new Date(isoString))
  } catch {
    return new Date(isoString).toLocaleTimeString()
  }
}

export function formatDayLabel(isoDateString, index) {
  if (index === 0) return 'Today'
  const date = new Date(`${isoDateString}T00:00:00`)
  return new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date)
}

export function formatFullDate(isoString, timezone) {
  if (!isoString) return '--'
  try {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      timeZone: timezone,
    }).format(new Date(isoString))
  } catch {
    return new Date(isoString).toDateString()
  }
}

export function windDirectionLabel(deg) {
  if (deg == null) return '--'
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
  return dirs[Math.round(deg / 22.5) % 16]
}

export function kmhToMph(kmh) {
  return kmh * 0.621371
}

export function cityLabel(city) {
  if (!city) return ''
  const parts = [city.name]
  if (city.admin1 && city.admin1 !== city.name) parts.push(city.admin1)
  if (city.country) parts.push(city.country)
  return parts.join(', ')
}
