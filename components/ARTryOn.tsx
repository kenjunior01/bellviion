"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Camera, X, RotateCcw, Download, AlertCircle, Smartphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/LanguageContext"

interface ARTryOnProps {
  product: {
    name: string
    image: string
    category: string
  }
  onClose: () => void
}

export function ARTryOn({ product, onClose }: ARTryOnProps) {
  const { t } = useLanguage()
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const [cameraActive, setCameraActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [demoMode, setDemoMode] = useState(false)
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null)

  const initializeCamera = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Check if mediaDevices is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera not supported on this device")
      }

      // Try different camera constraints in order of preference
      const constraints = [
        { video: true }, // Most flexible
        { video: { facingMode: "user" } }, // Front camera
        { video: { facingMode: "environment" } }, // Back camera
        { video: { width: 640, height: 480 } }, // Specific resolution
      ]

      let stream: MediaStream | null = null

      for (const constraint of constraints) {
        try {
          stream = await navigator.mediaDevices.getUserMedia(constraint)
          break
        } catch (err) {
          console.log(`Failed with constraint:`, constraint, err)
          continue
        }
      }

      if (!stream) {
        throw new Error("No camera available")
      }

      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream

        // Handle video play promise properly
        try {
          await videoRef.current.play()
          setCameraActive(true)
        } catch (playError) {
          console.error("Video play failed:", playError)
          // Try to play again after a short delay
          setTimeout(async () => {
            try {
              if (videoRef.current) {
                await videoRef.current.play()
                setCameraActive(true)
              }
            } catch (retryError) {
              console.error("Retry play failed:", retryError)
              setDemoMode(true)
            }
          }, 500)
        }
      }
    } catch (err: any) {
      console.error("Camera initialization failed:", err)

      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setError("Camera permission denied. Please allow camera access and try again.")
      } else if (err.name === "NotFoundError" || err.message.includes("not found")) {
        setError("No camera found on this device.")
      } else if (err.message.includes("not supported")) {
        setError("Camera not supported on this device.")
      } else {
        setError("Unable to access camera. Switching to demo mode.")
        setDemoMode(true)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    setCameraActive(false)
  }

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return

    const canvas = canvasRef.current
    const video = videoRef.current
    const ctx = canvas.getContext("2d")

    if (!ctx) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw video frame
    ctx.drawImage(video, 0, 0)

    // Convert to data URL
    const photoData = canvas.toDataURL("image/png")
    setCapturedPhoto(photoData)
  }

  const downloadPhoto = () => {
    if (!capturedPhoto) return

    const link = document.createElement("a")
    link.download = `bellvion-ar-${product.name.toLowerCase().replace(/\s+/g, "-")}.png`
    link.href = capturedPhoto
    link.click()
  }

  const retryCamera = () => {
    setError(null)
    setDemoMode(false)
    initializeCamera()
  }

  useEffect(() => {
    initializeCamera()

    return () => {
      stopCamera()
    }
  }, [])

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-black border border-gold/20 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gold/20">
            <div>
              <h2 className="text-xl font-light text-white">AR Try-On</h2>
              <p className="text-gold text-sm">{product.name}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-2">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {isLoading && (
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    className="w-12 h-12 border-2 border-gold border-t-transparent rounded-full mx-auto mb-4"
                  />
                  <p className="text-white">Initializing camera...</p>
                </div>
              </div>
            )}

            {error && !demoMode && (
              <div className="flex items-center justify-center h-96">
                <div className="text-center max-w-md">
                  <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                  <h3 className="text-white text-lg mb-2">Camera Error</h3>
                  <p className="text-gray-300 mb-6">{error}</p>
                  <div className="space-y-3">
                    <Button onClick={retryCamera} className="w-full bg-gold text-black hover:bg-gold/80">
                      <Camera className="w-4 h-4 mr-2" />
                      Try Again
                    </Button>
                    <Button
                      onClick={() => setDemoMode(true)}
                      variant="outline"
                      className="w-full border-gold text-gold hover:bg-gold hover:text-black"
                    >
                      <Smartphone className="w-4 h-4 mr-2" />
                      Demo Mode
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {(cameraActive || demoMode) && (
              <div className="relative">
                <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
                  {cameraActive && (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                      onLoadedMetadata={() => {
                        console.log("Video metadata loaded")
                      }}
                    />
                  )}

                  {demoMode && (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                      <div className="text-center">
                        <motion.div
                          animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.7, 1, 0.7],
                          }}
                          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                          className="w-32 h-32 mx-auto mb-4 relative"
                        >
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="w-full h-full object-contain"
                          />
                          <div className="absolute inset-0 bg-gold/20 rounded-full blur-xl" />
                        </motion.div>
                        <p className="text-white text-lg mb-2">{product.name}</p>
                        <p className="text-gray-400">Demo Mode - Product Preview</p>
                      </div>
                    </div>
                  )}

                  {/* AR Overlay */}
                  <div className="absolute inset-0 pointer-events-none">
                    {/* Face detection guide */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <motion.div
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                        className="w-64 h-80 border-2 border-gold/50 rounded-full"
                      />
                    </div>

                    {/* Product overlay for glasses */}
                    {product.category === "eyewear" && (
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -mt-8">
                        <motion.img
                          animate={{ opacity: [0.8, 1, 0.8] }}
                          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                          src={product.image}
                          alt={product.name}
                          className="w-48 h-auto opacity-80"
                        />
                      </div>
                    )}

                    {/* Instructions */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="bg-black/70 backdrop-blur-sm rounded-lg p-3">
                        <p className="text-white text-sm text-center">
                          {cameraActive
                            ? "Position your face in the guide and capture your look"
                            : "Demo mode - See how the product looks"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex justify-center space-x-4 mt-6">
                  {cameraActive && (
                    <Button onClick={capturePhoto} className="bg-gold text-black hover:bg-gold/80 px-6">
                      <Camera className="w-4 h-4 mr-2" />
                      Capture
                    </Button>
                  )}

                  {demoMode && (
                    <Button
                      onClick={retryCamera}
                      variant="outline"
                      className="border-gold text-gold hover:bg-gold hover:text-black px-6 bg-transparent"
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Try Camera
                    </Button>
                  )}

                  <Button
                    onClick={() => setDemoMode(!demoMode)}
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-600 px-6"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    {demoMode ? "Camera Mode" : "Demo Mode"}
                  </Button>
                </div>

                {/* Captured Photo */}
                {capturedPhoto && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-4 bg-gray-900 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-white font-medium">Captured Photo</h3>
                      <Button onClick={downloadPhoto} size="sm" className="bg-gold text-black hover:bg-gold/80">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                    <img
                      src={capturedPhoto || "/placeholder.svg"}
                      alt="Captured AR photo"
                      className="w-full max-w-xs mx-auto rounded-lg"
                    />
                  </motion.div>
                )}
              </div>
            )}
          </div>

          {/* Hidden canvas for photo capture */}
          <canvas ref={canvasRef} className="hidden" />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
