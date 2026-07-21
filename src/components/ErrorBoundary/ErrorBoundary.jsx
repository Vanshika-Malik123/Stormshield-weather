import { Component } from 'react'
import './ErrorBoundary.css'

/**
 * Catches render-time errors anywhere below it in the tree and shows
 * a readable message + stack instead of a silent blank white page.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('StormShield crashed:', error, info)
  }

  handleReset = () => {
    this.setState({ error: null })
  }

  render() {
    const { error } = this.state
    if (!error) return this.props.children

    return (
      <div className="crash-screen">
        <div className="crash-screen__card">
          <h1>Something broke while rendering StormShield</h1>
          <p>{error.message}</p>
          <pre>{error.stack}</pre>
          <div className="crash-screen__actions">
            <button type="button" onClick={this.handleReset}>Try again</button>
            <button type="button" onClick={() => window.location.reload()}>Reload page</button>
          </div>
        </div>
      </div>
    )
  }
}
