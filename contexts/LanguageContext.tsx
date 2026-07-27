"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type Language = "pt"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Portuguese translations
const translations = {
  pt: {
    // Navigation
    "nav.vision": "Visão",
    "nav.circle": "Círculo",
    "nav.pieces": "Museu",
    "nav.ascend": "Ascender",
    "nav.request": "Solicitar",

    // Common
    "common.return": "Voltar",
    "common.name": "Nome",
    "common.emailPlaceholder": "seu@email.com",

    // Hero
    "hero.tagline": "Autêntico, Raro, Memorável",
    "hero.teaser1": "Onde o luxo encontra a eternidade",
    "hero.teaser2": "Cada peça conta uma história única",
    "hero.teaser3": "Transcendendo o tempo através do design",
    "hero.teaser4": "A arte de ver além do comum",
    "hero.enterCircle": "Entrar no Círculo",
    "hero.beyondVision": "Além da Visão",
    "hero.description":
      "BELLVION transcende os limites convencionais do luxo, criando peças que não apenas adornam, mas transformam a percepção de quem as usa.",
    "hero.discoverVision": "Descobrir a Visão",

    // Footer
    "footer.signature": "Onde o legado encontra a eternidade",
  },
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("pt")

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.pt] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
