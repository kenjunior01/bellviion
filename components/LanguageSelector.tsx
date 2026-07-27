"use client"

import { useState } from "react"
import { Globe } from "lucide-react"

const languages = [{ code: "pt", name: "Português", flag: "🇵🇹" }]

export default function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false)
  const currentLanguage = languages[0] // Always Portuguese

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-black/20 backdrop-blur-sm border border-white/10 hover:border-gold/50 transition-all duration-300 text-white hover:text-gold"
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm font-light">{currentLanguage.flag}</span>
        <span className="text-sm font-light">PT</span>
      </button>
    </div>
  )
}
