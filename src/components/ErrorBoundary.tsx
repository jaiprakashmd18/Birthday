'use client'

import React, { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  name?: string
}

interface State {
  hasError: boolean
  error?: Error
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error(`[${this.props.name ?? 'ErrorBoundary'}]`, error, info)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div
          className="flex items-center justify-center py-20 text-center"
          style={{ color: 'rgba(255,255,255,0.3)' }}
        >
          <div>
            <div className="text-4xl mb-3">✨</div>
            <p className="text-sm">This section is loading...</p>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
