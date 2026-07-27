"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Upload, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import BackButton from "@/components/BackButton"

export default function RequestPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    productInterest: "",
    personalization: "",
    placement: "",
    purpose: "",
    inspiration: null as File | null,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/submit-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          type: "custom_request",
        }),
      })

      if (response.ok) {
        setSubmitted(true)
      }
    } catch (error) {
      console.error("Error submitting request:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData({ ...formData, inspiration: file })
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <BackButton />
        <div className="text-center max-w-2xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
            <div className="w-24 h-24 border-2 border-gold rounded-full flex items-center justify-center mx-auto mb-8">
              <Star className="w-8 h-8 text-gold" />
            </div>
            <h1 className="text-4xl font-light tracking-wide mb-6">Pedido Enviado</h1>
            <p className="text-xl text-gold mb-4">Entraremos em contacto consigo em breve.</p>
            <p className="text-gray-300">O seu pedido será analisado pela nossa equipa.</p>
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
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                className="w-24 h-24 border-2 border-gold rounded-full flex items-center justify-center"
              >
                <Star className="w-8 h-8 text-gold" />
              </motion.div>
            </div>

            <h1 className="text-5xl md:text-7xl font-light tracking-wide">
              <span className="text-gold">Solicitar</span>
            </h1>

            <p className="text-xl md:text-2xl font-light leading-relaxed text-gray-300 max-w-3xl mx-auto">
              Crie algo verdadeiramente único. A nossa equipa de artesãos especializados pode dar vida à sua visão
              através de peças personalizadas.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Custom Order Form */}
      <section className="pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <motion.form
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            onSubmit={handleSubmit}
            className="space-y-12"
          >
            {/* Contact Information */}
            <div className="space-y-6">
              <h2 className="text-3xl font-light tracking-wide text-gold text-center">A Sua Visão</h2>

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

            {/* Product Interest */}
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="productInterest" className="text-lg font-light tracking-wide">
                  Interesse do Produto
                </Label>
                <Select onValueChange={(value) => setFormData({ ...formData, productInterest: value })}>
                  <SelectTrigger className="bg-transparent border-gray-600 focus:border-gold text-white">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-600">
                    <SelectItem value="eyewear">Óculos</SelectItem>
                    <SelectItem value="watches">Relógios</SelectItem>
                    <SelectItem value="collectibles">Colecionáveis</SelectItem>
                    <SelectItem value="custom">Personalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Personalization */}
            <div className="space-y-6">
              <h3 className="text-2xl font-light tracking-wide text-gold">Personalização</h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="personalization" className="text-sm tracking-wide text-gray-300">
                    Pedido de Personalização
                  </Label>
                  <p className="text-xs text-gray-400 mb-2">
                    Descreva as personalizações desejadas (gravações, cores, materiais)
                  </p>
                  <Input
                    id="personalization"
                    value={formData.personalization}
                    onChange={(e) => setFormData({ ...formData, personalization: e.target.value })}
                    className="bg-transparent border-gray-600 focus:border-gold text-white"
                    placeholder="Ex: Gravação com iniciais, acabamento dourado..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="placement" className="text-sm tracking-wide text-gray-300">
                    Localização
                  </Label>
                  <p className="text-xs text-gray-400 mb-2">Onde deseja que a personalização seja aplicada</p>
                  <Input
                    id="placement"
                    value={formData.placement}
                    onChange={(e) => setFormData({ ...formData, placement: e.target.value })}
                    className="bg-transparent border-gray-600 focus:border-gold text-white"
                    placeholder="Ex: Interior da armação, mostrador do relógio..."
                  />
                </div>
              </div>
            </div>

            {/* Purpose & Story */}
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="purpose" className="text-lg font-light tracking-wide">
                  Propósito e História
                </Label>
                <p className="text-sm text-gray-400 mb-4">
                  Conte-nos a história por trás desta peça. Para que ocasião ou propósito é destinada?
                </p>
                <Textarea
                  id="purpose"
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  className="bg-transparent border-gray-600 focus:border-gold text-white min-h-32"
                  placeholder="Esta peça é especial porque..."
                  required
                />
              </div>
            </div>

            {/* Inspiration Upload */}
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="inspiration" className="text-lg font-light tracking-wide">
                  Inspiração Visual
                </Label>
                <p className="text-sm text-gray-400 mb-4">Carregue imagens que inspirem o seu design (opcional)</p>
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-gold transition-colors">
                  <input type="file" id="inspiration" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  <label htmlFor="inspiration" className="cursor-pointer">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400">
                      {formData.inspiration ? formData.inspiration.name : "Clique para carregar imagens"}
                    </p>
                  </label>
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="text-center pt-8">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="px-16 py-4 bg-transparent border border-gold text-gold hover:bg-gold hover:text-black transition-all duration-500 tracking-widest text-sm disabled:opacity-50"
              >
                {isSubmitting ? "A ENVIAR..." : "ENVIAR PEDIDO"}
              </Button>

              <div className="mt-8 p-6 bg-gray-900 rounded-lg">
                <p className="text-lg font-light text-gold mb-2">"Entraremos em contacto consigo em breve."</p>
                <p className="text-sm text-gray-400 leading-relaxed">
                  O seu pedido será analisado pela nossa equipa de artesãos especializados.
                </p>
              </div>
            </div>
          </motion.form>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-20 bg-gradient-to-t from-gray-900 to-black">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="space-y-8"
          >
            <h3 className="text-3xl font-light tracking-wide">A Arte da Personalização</h3>
            <p className="text-lg text-gray-300 leading-relaxed max-w-3xl mx-auto">
              Cada peça personalizada é uma obra de arte única, criada especificamente para refletir a sua personalidade
              e história. Os nossos artesãos combinam técnicas tradicionais com inovação moderna para dar vida à sua
              visão.
            </p>
            <div className="pt-8">
              <blockquote className="text-xl italic font-light text-gold">
                "O verdadeiro luxo é ter algo que ninguém mais no mundo possui."
              </blockquote>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
