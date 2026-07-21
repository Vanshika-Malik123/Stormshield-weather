import { FiAlertTriangle, FiRefreshCw } from 'react-icons/fi'
import './ErrorMessage.css'

export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-message glass" role="alert">
      <FiAlertTriangle className="error-message__icon" />
      <div>
        <h3>Couldn't load the forecast</h3>
        <p>{message || 'Something went wrong. Please try again.'}</p>
      </div>
      {onRetry && (
        <button type="button" className="error-message__retry" onClick={onRetry}>
          <FiRefreshCw />
          Retry
        </button>
      )}
    </div>
  )
}
