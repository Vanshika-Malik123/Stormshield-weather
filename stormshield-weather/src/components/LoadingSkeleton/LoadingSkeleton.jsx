import './LoadingSkeleton.css'

export default function LoadingSkeleton() {
  return (
    <div className="skeleton" aria-live="polite" aria-busy="true">
      <div className="skeleton__card glass">
        <div className="skeleton__row">
          <div className="skeleton__block skeleton__block--sm" />
          <div className="skeleton__block skeleton__block--circle" />
        </div>
        <div className="skeleton__block skeleton__block--lg" />
        <div className="skeleton__block skeleton__block--md" />
      </div>

      <div className="skeleton__grid">
        {Array.from({ length: 8 }).map((_, i) => (
          <div className="skeleton__mini glass" key={i}>
            <div className="skeleton__block skeleton__block--xs" />
            <div className="skeleton__block skeleton__block--sm" />
          </div>
        ))}
      </div>

      <span className="visually-hidden">Loading weather data…</span>
    </div>
  )
}
