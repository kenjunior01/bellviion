"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Eye, Crown, Infinity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import BackButton from "@/components/BackButton"

export default function CirclePage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    styleVision: "",
    legacyReason: "",
    inspiration: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/submit-application", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          type: "circle_application",
        }),
      })

      if (response.ok) {
        setSubmitted(true)
      }
    } catch (error) {
      console.error("Error submitting application:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <BackButton />
        <div className="text-center max-w-2xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
            <div className="w-24 h-24 border-2 border-gold rounded-full flex items-center justify-center mx-auto mb-8">
              <Eye className="w-8 h-8 text-gold" />
            </div>
            <h1 className="text-4xl font-light tracking-wide mb-6">Candidatura Enviada</h1>
            <p className="text-xl text-gold mb-4">Entraremos em contacto consigo em breve.</p>
            <p className="text-gray-300">A sua candidatura será analisada pela nossa equipa.</p>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <BackButton />

      {/* Hero Section */}
      <section className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="space-y-8"
          >
            <div className="flex justify-center mb-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-24 h-24 border-2 border-gold rounded-full flex items-center justify-center"
              >
                <Eye className="w-8 h-8 text-gold" />
              </motion.div>
            </div>

            <h1 className="text-5xl md:text-7xl font-light tracking-wide">O Círculo</h1>

            <p className="text-xl md:text-2xl font-light leading-relaxed text-gray-300 max-w-3xl mx-auto">
              "Onde visões se encontram e legados nascem"
            </p>

            <div className="pt-8">
              <p className="text-lg text-gray-400 leading-relaxed">
                O Círculo BELLVION é uma comunidade exclusiva de visionários que partilham a paixão pela excelência e
                pela inovação. Aqui, cada membro contribui para a evolução contínua da marca.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-6">
          <motion.form
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            onSubmit={handleSubmit}
            className="space-y-12"
          >
            {/* Personal Information */}
            <div className="space-y-6">
              <h2 className="text-2xl font-light tracking-wide text-gold">A Sua Identidade</h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm tracking-wide text-gray-300">
                    Nome Completo
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-transparent border-gray-600 focus:border-gold text-white"
                    placeholder="O seu nome"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm tracking-wide text-gray-300">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-transparent border-gray-600 focus:border-gold text-white"
                    placeholder="seu@email.com"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Vision Questions */}
            <div className="space-y-8">
              <h2 className="text-2xl font-light tracking-wide text-gold">A Sua Visão</h2>

              <div className="space-y-2">
                <Label htmlFor="styleVision" className="text-lg font-light tracking-wide">
                  Como define o seu estilo pessoal?
                </Label>
                <p className="text-sm text-gray-400 mb-4">
                  Descreva a sua filosofia de estilo e como ela reflete a sua personalidade.
                </p>
                <Textarea
                  id="styleVision"
                  value={formData.styleVision}
                  onChange={(e) => setFormData({ ...formData, styleVision: e.target.value })}
                  className="bg-transparent border-gray-600 focus:border-gold text-white min-h-32"
                  placeholder="O meu estilo é..."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="legacyReason" className="text-lg font-light tracking-wide">
                  Que legado deseja construir?
                </Label>
                <p className="text-sm text-gray-400 mb-4">
                  Partilhe a sua visão sobre o impacto que deseja ter no mundo.
                </p>
                <Textarea
                  id="legacyReason"
                  value={formData.legacyReason}
                  onChange={(e) => setFormData({ ...formData, legacyReason: e.target.value })}
                  className="bg-transparent border-gray-600 focus:border-gold text-white min-h-32"
                  placeholder="O meu legado será..."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="inspiration" className="text-lg font-light tracking-wide">
                  O que o inspira diariamente?
                </Label>
                <p className="text-sm text-gray-400 mb-4">Conte-nos sobre as suas fontes de inspiração e motivação.</p>
                <Textarea
                  id="inspiration"
                  value={formData.inspiration}
                  onChange={(e) => setFormData({ ...formData, inspiration: e.target.value })}
                  className="bg-transparent border-gray-600 focus:border-gold text-white min-h-32"
                  placeholder="Inspiro-me em..."
                  required
                />
              </div>
            </div>

            {/* Submit */}
            <div className="text-center pt-8">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="px-12 py-4 bg-transparent border border-gold text-gold hover:bg-gold hover:text-black transition-all duration-500 tracking-widest text-sm disabled:opacity-50"
              >
                {isSubmitting ? "A ENVIAR..." : "CANDIDATAR-SE"}
              </Button>

              <p className="text-sm text-gray-400 mt-6 leading-relaxed">
                Entraremos em contacto consigo em breve.
                <br />A sua candidatura será analisada pela nossa equipa.
              </p>
            </div>
          </motion.form>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-20 bg-gradient-to-t from-gray-900 to-black">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="space-y-8"
          >
            <div className="flex justify-center space-x-8 mb-12">
              <Crown className="w-8 h-8 text-gold" />
              <Infinity className="w-8 h-8 text-gold" />
              <Eye className="w-8 h-8 text-gold" />
            </div>

            <blockquote className="text-2xl md:text-3xl font-light italic leading-relaxed">
              "O verdadeiro luxo não está no que possuímos, mas no que nos tornamos através das nossas escolhas."
            </blockquote>

            <p className="text-gold tracking-widest text-sm">— MANIFESTO BELLVION</p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
