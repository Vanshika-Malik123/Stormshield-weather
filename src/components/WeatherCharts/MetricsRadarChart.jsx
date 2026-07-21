import { useMemo } from 'react'
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  Tooltip,
} from 'recharts'
import { useWeather } from '../../context/WeatherContext.jsx'

function clampPercent(value) {
  if (value == null || Number.isNaN(value)) return 0
  return Math.max(0, Math.min(100, value))
}

function RadarTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const point = payload[0].payload
  return (
    <div className="chart-tooltip glass">
      <span className="chart-tooltip__label mono">{point.metric}</span>
      <span className="chart-tooltip__value">{point.raw}</span>
    </div>
  )
}

/**
 * A six-axis radar of the current conditions — humidity, wind, UV,
 * chance of rain, air quality, and cloud cover — each normalized to
 * a 0-100 scale so very different units can share one chart.
 */
export default function MetricsRadarChart() {
  const { current, forecast, air } = useWeather()

  const data = useMemo(() => {
    if (!current || !forecast) return []
    const uv = forecast.daily?.uv_index_max?.[0] ?? 0
    const rainChance = forecast.daily?.precipitation_probability_max?.[0] ?? 0
    const aqi = air?.us_aqi

    return [
      {
        metric: 'Humidity',
        value: clampPercent(current.relative_humidity_2m),
        raw: `${Math.round(current.relative_humidity_2m ?? 0)}%`,
      },
      {
        metric: 'Wind',
        value: clampPercent(((current.wind_speed_10m ?? 0) / 60) * 100),
        raw: `${Math.round(current.wind_speed_10m ?? 0)} km/h`,
      },
      {
        metric: 'UV Index',
        value: clampPercent((uv / 11) * 100),
        raw: `${Math.round(uv)}`,
      },
      {
        metric: 'Rain Chance',
        value: clampPercent(rainChance),
        raw: `${Math.round(rainChance)}%`,
      },
      {
        metric: 'Air Quality',
        value: clampPercent(((aqi ?? 0) / 300) * 100),
        raw: aqi != null ? `AQI ${Math.round(aqi)}` : 'N/A',
      },
      {
        metric: 'Cloud Cover',
        value: clampPercent(current.cloud_cover),
        raw: `${Math.round(current.cloud_cover ?? 0)}%`,
      },
    ]
  }, [current, forecast, air])

  if (data.length === 0) return null

  return (
    <div className="radar-chart">
      <ResponsiveContainer width="100%" height={260}>
        <RadarChart data={data} outerRadius="76%">
          <PolarGrid stroke="var(--glass-border)" />
          <PolarAngleAxis dataKey="metric" tick={{ fill: 'var(--text-secondary)', fontSize: 11.5 }} />
          <Tooltip content={<RadarTooltip />} />
          <Radar
            dataKey="value"
            stroke="var(--aurora-violet)"
            fill="var(--aurora-violet)"
            fillOpacity={0.38}
            strokeWidth={2}
            animationDuration={1100}
            animationEasing="ease-out"
            dot={{ r: 3, fill: 'var(--aurora-violet-soft)', strokeWidth: 0 }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
