"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Eye, Circle, ShoppingBag, ArrowUp, LogIn } from "lucide-react"

export function LuxuryNavigation() {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { label: "Visão", href: "/vision", icon: Eye, description: "Nossa história e missão" },
    { label: "Círculo", href: "/circle", icon: Circle, description: "Comunidade exclusiva" },
    { label: "Loja", href: "/loja", icon: ShoppingBag, description: "Coleção BELLVION" },
    { label: "Ascender", href: "/ascend", icon: ArrowUp, description: "Torne-se agente" },
  ]

  return (
    <>
      {/* Fixed Navigation Bar - Desktop */}
      <nav className="hidden md:fixed md:top-0 md:left-0 md:right-0 md:z-50 md:bg-black/50 md:backdrop-blur-md md:border-b md:border-gold/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 border border-gold rounded-full flex items-center justify-center group-hover:bg-gold/10 transition-all">
              <span className="text-gold text-xs font-bold">B</span>
            </div>
            <span className="text-gold font-light tracking-widest text-sm hidden sm:inline">BELLVION</span>
          </Link>

          {/* Desktop Menu */}
          <div className="flex items-center space-x-8">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <motion.div
                  whileHover={{ y: -2 }}
                  className="flex items-center space-x-2 text-white hover:text-gold transition-colors cursor-pointer group"
                >
                  <item.icon className="w-4 h-4" />
                  <span className="text-sm font-light tracking-wide">{item.label}</span>
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                    className="h-px w-6 bg-gold origin-left"
                  />
                </motion.div>
              </Link>
            ))}
            <Link href="/auth/login">
              <motion.div whileHover={{ scale: 1.05 }} className="p-2 border border-gold/30 rounded-full hover:border-gold transition-all">
                <LogIn className="w-4 h-4 text-gold" />
              </motion.div>
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Hamburger Menu */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 border border-gold rounded-lg hover:bg-gold/10 transition-all"
        >
          {isOpen ? <X className="w-6 h-6 text-gold" /> : <Menu className="w-6 h-6 text-gold" />}
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 right-4 z-40 bg-black/95 backdrop-blur-md border border-gold/30 rounded-lg shadow-2xl md:hidden"
          >
            <div className="p-4 space-y-3 min-w-48">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
                  <motion.div
                    whileHover={{ x: 5 }}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gold/10 transition-all cursor-pointer group"
                  >
                    <item.icon className="w-5 h-5 text-gold group-hover:scale-110 transition-transform" />
                    <div>
                      <p className="text-white font-light text-sm">{item.label}</p>
                      <p className="text-gray-400 text-xs">{item.description}</p>
                    </div>
                  </motion.div>
                </Link>
              ))}
              <div className="border-t border-gold/20 pt-3">
                <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                  <motion.div whileHover={{ x: 5 }} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gold/10 transition-all cursor-pointer group">
                    <LogIn className="w-5 h-5 text-gold group-hover:scale-110 transition-transform" />
                    <p className="text-white font-light text-sm">Admin Login</p>
                  </motion.div>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
