"use client"

import type React from "react"
import { Component, type ReactNode } from "react"
import { motion } from "framer-motion"

interface Props {
  children: ReactNode
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

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("BELLVION Error Boundary caught an error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-md mx-auto px-6"
          >
            <div className="w-24 h-24 border-2 border-gold rounded-full flex items-center justify-center mx-auto mb-8">
              <span className="text-gold text-2xl">!</span>
            </div>
            <h1 className="text-3xl font-light tracking-wide mb-4">Something went wrong</h1>
            <p className="text-gray-300 mb-8">
              The vision encountered an unexpected error. Please refresh the page or return to the beginning.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-8 py-3 border border-gold text-gold hover:bg-gold hover:text-black transition-all duration-500 tracking-widest text-sm"
            >
              REFRESH PAGE
            </button>
          </motion.div>
        </div>
      )
    }

    return this.props.children
  }
}
