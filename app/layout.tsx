import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display, Lato } from "next/font/google"
import { LanguageProvider } from "@/contexts/LanguageContext"
import { AIConcierge } from "@/components/ai-concierge" // Added AI Concierge component
import "./globals.css"

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

const lato = Lato({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  variable: "--font-lato",
  display: "swap",
})

export const metadata: Metadata = {
  title: "BELLVION - Autêntico, Raro, Memorável",
  description:
    "Óculos de luxo ultra-premium, relógios e colecionáveis. Autêntico, Raro, Memorável. Onde o estilo transcende o tempo.",
  keywords: "óculos de luxo, relógios premium, colecionáveis, BELLVION, moda exclusiva, Moçambique",
  authors: [{ name: "BELLVION" }],
  creator: "BELLVION",
  publisher: "BELLVION",
  robots: "index, follow",
  openGraph: {
    title: "BELLVION - Autêntico, Raro, Memorável",
    description: "Óculos de luxo ultra-premium, relógios e colecionáveis. Autêntico, Raro, Memorável.",
    type: "website",
    locale: "pt_PT",
    alternateLocale: ["en_US", "it_IT"],
    url: "https://bellvion.com",
    siteName: "BELLVION",
  },
  twitter: {
    card: "summary_large_image",
    title: "BELLVION - Autêntico, Raro, Memorável",
    description: "Óculos de luxo ultra-premium, relógios e colecionáveis. Autêntico, Raro, Memorável.",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt" className={`${playfair.variable} ${lato.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#CBA135" />
      </head>
      <body className="font-sans antialiased">
        <LanguageProvider>
          {children}
          <AIConcierge /> {/* Added AI Concierge for sitewide access */}
        </LanguageProvider>
      </body>
    </html>
  )
}
