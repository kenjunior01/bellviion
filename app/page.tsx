"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Volume2, VolumeX, Sparkles, Play, Pause } from "lucide-react"
import { LuxuryNavigation } from "@/components/luxury-navigation"
import AnimatedBackground from "@/components/animated-background" // Declare the AnimatedBackground variable

// Door Menu Component - Menus estilo portas nos cantos (mantido para compatibilidade)
const DoorMenus = () => {
  const [hoveredDoor, setHoveredDoor] = useState<string | null>(null)

  const doors = [
    {
      id: "vision",
      label: "Visão",
      href: "/vision",
      position: "top-left",
      icon: "V",
      description: "Nossa história e missão",
    },
    {
      id: "circle",
      label: "Círculo",
      href: "/circle",
      position: "top-right",
      icon: "C",
      description: "Comunidade exclusiva",
    },
    {
      id: "store",
      label: "Loja",
      href: "/loja",
      position: "bottom-left",
      icon: "L",
      description: "Coleção BELLVION",
    },
    {
      id: "ascend",
      label: "Ascender",
      href: "/ascend",
      position: "bottom-right",
      icon: "A",
      description: "Torne-se agente",
    },
  ]

  const getPositionClasses = (position: string) => {
    switch (position) {
      case "top-left":
        return "top-4 left-4 md:top-8 md:left-8"
      case "top-right":
        return "top-4 right-4 md:top-8 md:right-8"
      case "bottom-left":
        return "bottom-20 left-4 md:bottom-24 md:left-8"
      case "bottom-right":
        return "bottom-20 right-4 md:bottom-24 md:right-8"
      default:
        return ""
    }
  }

  const getHoverDirection = (position: string) => {
    if (position.includes("left")) return { x: 10 }
    if (position.includes("right")) return { x: -10 }
    return { y: -10 }
  }

  return (
    <>
      {doors.map((door, index) => (
        <motion.div
          key={door.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5 + index * 0.2, duration: 0.6 }}
          className={`fixed z-40 ${getPositionClasses(door.position)}`}
          onMouseEnter={() => setHoveredDoor(door.id)}
          onMouseLeave={() => setHoveredDoor(null)}
        >
          <Link href={door.href}>
            <motion.div
              whileHover={getHoverDirection(door.position)}
              whileTap={{ scale: 0.95 }}
              className="relative group"
            >
              {/* Door Frame */}
              <div className="relative w-16 h-24 md:w-20 md:h-28 bg-gradient-to-b from-gray-800 to-gray-900 rounded-t-xl border-2 border-gold/40 overflow-hidden shadow-2xl cursor-pointer">
                {/* Door Handle */}
                <div className="absolute right-2 top-1/2 -translate-y-1/2 w-1.5 h-4 bg-gold rounded-full shadow-lg" />

                {/* Door Light Effect */}
                <motion.div
                  animate={{
                    opacity: hoveredDoor === door.id ? [0.3, 0.6, 0.3] : 0.1,
                  }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  className="absolute inset-0 bg-gradient-to-t from-gold/20 to-transparent"
                />

                {/* Door Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-gold font-serif text-2xl md:text-3xl font-light">{door.icon}</span>
                </div>

                {/* Shine Effect */}
                <motion.div
                  animate={{ x: [-100, 200] }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, repeatDelay: 2 }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
                />
              </div>

              {/* Door Label */}
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2 + index * 0.2 }}
                className="mt-2 text-center"
              >
                <p className="text-gold text-xs md:text-sm font-light tracking-wider">{door.label}</p>
              </motion.div>

              {/* Hover Tooltip */}
              <AnimatePresence>
                {hoveredDoor === door.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className={`absolute mt-2 px-3 py-2 bg-black/90 backdrop-blur-sm border border-gold/30 rounded-lg whitespace-nowrap ${
                      door.position.includes("right") ? "right-0" : "left-0"
                    }`}
                  >
                    <p className="text-white text-xs">{door.description}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </Link>
        </motion.div>
      ))}

      {/* Admin Door - Subtle */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 1 }}
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40"
      >
        <Link href="/auth/login">
          <motion.div
            whileHover={{ scale: 1.05, opacity: 1 }}
            className="px-4 py-2 bg-black/50 backdrop-blur-sm border border-gold/20 rounded-full opacity-50 hover:opacity-100 transition-opacity"
          >
            <span className="text-gold/60 text-xs tracking-widest">ADMIN</span>
          </motion.div>
        </Link>
      </motion.div>
    </>
  )
}

// Floating Orbs Animation
const FloatingOrbs = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-gold/40 rounded-full blur-sm"
          initial={{
            x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1920),
            y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 1080),
          }}
          animate={{
            x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1920),
            y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 1080),
          }}
          transition={{
            duration: 25 + Math.random() * 15,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            ease: "linear",
          }}
        />
      ))}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`medium-${i}`}
          className="absolute w-2 h-2 bg-gold/30 rounded-full blur-md"
          initial={{
            x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1920),
            y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 1080),
          }}
          animate={{
            x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1920),
            y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 1080),
          }}
          transition={{
            duration: 30 + Math.random() * 20,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            ease: "linear",
          }}
        />
      ))}
    </div>
  )
}

export default function HomePage() {
  const [currentPhrase, setCurrentPhrase] = useState(0)
  const [soundEnabled, setSoundEnabled] = useState(false)
  const [videoPlaying, setVideoPlaying] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  const teaserPhrases = [
    "Onde o luxo encontra a eternidade",
    "Cada peça conta uma história única",
    "Transcendendo o tempo através do design",
    "A arte de ver além do comum",
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhrase((prev) => (prev + 1) % teaserPhrases.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [teaserPhrases.length])

  useEffect(() => {
    if (videoRef.current) {
      if (videoPlaying) {
        videoRef.current.play()
      } else {
        videoRef.current.pause()
      }
    }
  }, [videoPlaying])

  useEffect(() => {
    if (soundEnabled && typeof window !== "undefined") {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.setValueAtTime(60, audioContext.currentTime)
      gainNode.gain.setValueAtTime(0.02, audioContext.currentTime)
      oscillator.type = "sine"

      oscillator.start()

      return () => {
        oscillator.stop()
        audioContext.close()
      }
    }
  }, [soundEnabled])

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Luxury Navigation */}
      <LuxuryNavigation />

      {/* Animated Background Particles */}
      <AnimatedBackground />

      {/* Video Background */}
      <div className="absolute inset-0 overflow-hidden">
        <video ref={videoRef} autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
          <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Generated%20File%20September%2022%2C%202025%20-%2012_53PM-Z8r2Qx8IahF8tAtqcaYKmAa3gPn1Kt.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />
      </div>

      {/* Video Control Button */}
      <button
        onClick={() => setVideoPlaying(!videoPlaying)}
        className="absolute top-4 left-1/2 ml-12 z-40 bg-black/50 backdrop-blur-sm text-white hover:text-gold transition-colors duration-300 p-2 rounded-full border border-white/20 hover:border-gold/50"
      >
        {videoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
      </button>

      {/* Animated BV Monogram */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="relative z-10 text-center px-4"
      >
        <motion.div
          animate={{
            textShadow: [
              "0 0 20px #CBA135, 0 0 40px #CBA135, 0 0 60px #CBA135",
              "0 0 40px #CBA135, 0 0 80px #CBA135, 0 0 120px #CBA135",
              "0 0 20px #CBA135, 0 0 40px #CBA135, 0 0 60px #CBA135",
            ],
          }}
          transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
          className="text-6xl md:text-8xl lg:text-9xl font-serif text-gold mb-6 md:mb-8 relative"
        >
          BV
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="absolute -top-2 md:-top-4 -right-2 md:-right-4"
          >
            <Sparkles className="w-4 h-4 md:w-6 md:h-6 lg:w-8 lg:h-8 text-gold/60" />
          </motion.div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="text-3xl md:text-5xl lg:text-6xl font-light tracking-wider mb-4"
        >
          BELLVION
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 1 }}
          className="text-lg md:text-xl lg:text-2xl text-gold font-light tracking-widest"
        >
          Autêntico, Raro, Memorável
        </motion.p>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 1 }}
        className="absolute bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}>
          <ChevronDown className="w-5 h-5 md:w-6 md:h-6 text-gold" />
        </motion.div>
      </motion.div>

      {/* Teaser Phrases Section */}
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black to-gray-900 relative">
        <div className="text-center max-w-4xl mx-auto px-4 md:px-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPhrase}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 1 }}
              className="text-2xl md:text-4xl lg:text-5xl font-light tracking-wide leading-relaxed"
            >
              {teaserPhrases[currentPhrase]}
            </motion.div>
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="mt-12 md:mt-16"
          >
            <Link
              href="/loja"
              className="inline-block px-6 md:px-8 py-3 md:py-4 border border-gold text-gold hover:bg-gold hover:text-black transition-all duration-500 tracking-widest text-sm relative overflow-hidden group"
            >
              <span className="relative z-10">Explorar Coleção</span>
              <div className="absolute inset-0 bg-gradient-to-r from-gold/0 via-gold/20 to-gold/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Brand Essence Section */}
      <section className="min-h-screen flex items-center justify-center bg-white text-black relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-6 grid lg:grid-cols-3 gap-8 md:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="lg:col-span-2 space-y-6 md:space-y-8"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-wide">
              Além da <span className="text-gold">Visão</span>
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-gray-700">
              BELLVION transcende os limites convencionais do luxo, criando peças que não apenas adornam, mas
              transformam a percepção de quem as usa. Cada criação é uma jornada através do tempo, onde a tradição
              encontra a inovação.
            </p>
            <div className="pt-6 md:pt-8">
              <Link
                href="/vision"
                className="inline-block px-6 md:px-8 py-3 md:py-4 bg-black text-white hover:bg-gold hover:text-black transition-all duration-500 tracking-widest text-sm relative overflow-hidden group"
              >
                <span className="relative z-10">Descobrir a Visão</span>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="relative">
              <img
                src="/images/bellvion-fashion-model.jpeg"
                alt="BELLVION Luxury Eyewear"
                className="w-full rounded-lg shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-8 md:py-12 border-t border-gold/20 relative">
        <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
            <p className="text-gold font-light tracking-widest text-sm mb-4">Onde o legado encontra a eternidade</p>
            <div className="flex flex-col md:flex-row justify-center items-center space-y-2 md:space-y-0 md:space-x-8 text-xs text-gray-400">
              <span>© 2025 BELLVION</span>
              <span className="hidden md:block">•</span>
              <span>Autêntico, Raro, Memorável</span>
            </div>
          </motion.div>
        </div>
      </footer>
    </div>
  )
}
