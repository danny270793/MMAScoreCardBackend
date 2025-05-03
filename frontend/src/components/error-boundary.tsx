import React, { ErrorInfo } from 'react'
import { Button } from '../components/button'
import { Logger } from '../utils/logger'

const logger: Logger = new Logger('/src/pages/error-boundary.tsx')

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

interface ErrorBoundaryState {
  error: Error | null
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error(`error=${error} errorInfo=${errorInfo}`)
  }

  render() {
    if (this.state.error) {
      return (
        this.props.fallback || (
          <div className="w3-display-container" style={{ height: '100vh' }}>
            <div className="w3-display-middle w3-center">
              <h2>Something went wrong.</h2>
              <Button type="info" onClick={() => window.location.reload()}>
                Reload
              </Button>
            </div>
          </div>
        )
      )
    }

    return this.props.children
  }
}
