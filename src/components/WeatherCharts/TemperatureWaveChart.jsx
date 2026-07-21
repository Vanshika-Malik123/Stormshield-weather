import { useMemo } from 'react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import { useWeather } from '../../context/WeatherContext.jsx'
import { convertTemp, formatHour, formatTemp } from '../../utils/formatters.js'

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="chart-tooltip glass">
      <span className="chart-tooltip__label mono">{label}</span>
      <span className="chart-tooltip__value">{payload[0].payload.display}</span>
    </div>
  )
}

/**
 * A 24-hour temperature "wave" — a smooth animated area chart built
 * straight from the live Open-Meteo hourly forecast.
 */
export default function TemperatureWaveChart() {
  const { forecast, unit } = useWeather()

  const data = useMemo(() => {
    if (!forecast?.hourly) return []
    const nowIso = forecast.current?.time
    const startIndex = Math.max(0, forecast.hourly.time.findIndex((t) => t >= nowIso))
    return forecast.hourly.time.slice(startIndex, startIndex + 24).map((time, i) => {
      const idx = startIndex + i
      const temp = convertTemp(forecast.hourly.temperature_2m[idx], unit)
      return {
        hour: i === 0 ? 'Now' : formatHour(time, forecast.timezone),
        temp: Math.round(temp),
        display: formatTemp(temp, unit),
      }
    })
  }, [forecast, unit])

  if (data.length === 0) return null

  return (
    <div className="wave-chart">
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 16, right: 12, left: -12, bottom: 0 }}>
          <defs>
            <linearGradient id="waveFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--sky-cyan)" stopOpacity={0.55} />
              <stop offset="100%" stopColor="var(--sky-cyan)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="var(--glass-border)" strokeDasharray="4 8" />
          <XAxis
            dataKey="hour"
            interval={2}
            tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }}
            axisLine={{ stroke: 'var(--glass-border)' }}
            tickLine={false}
          />
          <YAxis
            dataKey="temp"
            tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={34}
          />
          <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'var(--accent-soft)', strokeDasharray: '3 3' }} />
          <Area
            type="monotone"
            dataKey="temp"
            stroke="var(--sky-cyan)"
            strokeWidth={2.5}
            fill="url(#waveFill)"
            animationDuration={1200}
            animationEasing="ease-out"
            dot={false}
            activeDot={{ r: 5, fill: 'var(--sky-cyan)', stroke: 'var(--bg-app)', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
