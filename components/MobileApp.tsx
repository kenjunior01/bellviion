"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Smartphone, Apple, PlayCircle, Star, Shield, Zap, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/LanguageContext"

export function MobileApp() {
  const { t } = useLanguage()
  const [isVisible, setIsVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    // Only show on desktop after delay
    if (!isMobile) {
      const timer = setTimeout(() => setIsVisible(true), 3000)
      return () => {
        clearTimeout(timer)
        window.removeEventListener("resize", checkMobile)
      }
    }

    return () => window.removeEventListener("resize", checkMobile)
  }, [isMobile])

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "AR Try-On",
      description: "Experimente produtos em realidade aumentada",
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Coleção Exclusiva",
      description: "Acesso a peças limitadas e lançamentos",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Autenticidade",
      description: "Certificação digital de cada produto",
    },
  ]

  // Don't show on mobile devices
  if (isMobile || !isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="fixed bottom-6 right-6 z-40 max-w-sm hidden md:block"
      >
        <div className="bg-black/90 backdrop-blur-md border border-gold/20 rounded-2xl p-6 text-white shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-gold to-gold/80 rounded-xl flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-black" />
              </div>
              <div>
                <h3 className="font-semibold">BELLVION App</h3>
                <p className="text-xs text-gray-400">Experiência Premium</p>
              </div>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-white transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3 mb-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-3"
              >
                <div className="text-gold">{feature.icon}</div>
                <div>
                  <p className="text-sm font-medium">{feature.title}</p>
                  <p className="text-xs text-gray-400">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="space-y-3">
            <Button className="w-full bg-gold text-black hover:bg-gold/80 flex items-center justify-center space-x-2">
              <Apple className="w-5 h-5" />
              <span>App Store</span>
            </Button>

            <Button
              variant="outline"
              className="w-full border-gold text-gold hover:bg-gold hover:text-black flex items-center justify-center space-x-2 bg-transparent"
            >
              <PlayCircle className="w-5 h-5" />
              <span>Google Play</span>
            </Button>
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">Disponível para iOS e Android</p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
