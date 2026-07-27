"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Users,
  TrendingUp,
  Gift,
  Award,
  MapPin,
  Phone,
  Mail,
  User,
  Calendar,
  CheckCircle,
  Sparkles,
  DollarSign,
  Globe,
  Shield,
  Star,
  ArrowRight,
  Loader2,
} from "lucide-react"
import BackButton from "@/components/BackButton"
import { createClient } from "@/lib/supabase/client"

const benefits = [
  {
    icon: <DollarSign className="w-8 h-8" />,
    title: "Comissões Atrativas",
    description: "Ganhe até 15% de comissão em cada venda realizada. Quanto mais vender, maior a sua comissão.",
    highlight: "Até 15%",
  },
  {
    icon: <Gift className="w-8 h-8" />,
    title: "Produtos Exclusivos",
    description: "Acesso antecipado a novos lançamentos e produtos exclusivos para agentes.",
    highlight: "Acesso VIP",
  },
  {
    icon: <TrendingUp className="w-8 h-8" />,
    title: "Crescimento Profissional",
    description: "Formação contínua em vendas de luxo e desenvolvimento pessoal.",
    highlight: "Formação Grátis",
  },
  {
    icon: <Award className="w-8 h-8" />,
    title: "Reconhecimento",
    description: "Prémios mensais para os melhores agentes e reconhecimento público.",
    highlight: "Top Performers",
  },
  {
    icon: <Globe className="w-8 h-8" />,
    title: "Rede Internacional",
    description: "Faça parte de uma rede global de agentes BELLVION em crescimento.",
    highlight: "Global",
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Suporte Dedicado",
    description: "Equipa de suporte exclusiva para ajudar em todas as suas vendas.",
    highlight: "24/7",
  },
]

const steps = [
  { number: "01", title: "Candidatura", description: "Preencha o formulário com os seus dados" },
  { number: "02", title: "Análise", description: "A nossa equipa avalia a sua candidatura" },
  { number: "03", title: "Aprovação", description: "Receba a confirmação por email" },
  { number: "04", title: "Formação", description: "Complete a formação inicial online" },
  { number: "05", title: "Início", description: "Comece a vender e ganhar comissões" },
]

const testimonials = [
  {
    name: "João Silva",
    location: "Maputo, Moçambique",
    text: "Ser agente BELLVION mudou a minha vida. As comissões são excelentes e o suporte é incrível.",
    sales: "50+ vendas",
  },
  {
    name: "Maria Santos",
    location: "Beira, Moçambique",
    text: "A formação que recebi ajudou-me a entender melhor o mercado de luxo. Recomendo!",
    sales: "35+ vendas",
  },
  {
    name: "Carlos Nhambe",
    location: "Nampula, Moçambique",
    text: "O reconhecimento e os prémios motivam-me a dar sempre o meu melhor.",
    sales: "80+ vendas",
  },
]

export default function AscendPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    country: "Moçambique",
    province: "",
    city: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const provinces = [
    "Maputo Cidade",
    "Maputo Província",
    "Gaza",
    "Inhambane",
    "Sofala",
    "Manica",
    "Tete",
    "Zambézia",
    "Nampula",
    "Cabo Delgado",
    "Niassa",
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage("")

    try {
      const supabase = createClient()

      const { error } = await supabase.from("agents").insert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        age: Number.parseInt(formData.age),
        country: formData.country,
        province: formData.province,
        city: formData.city || null,
        status: "pending",
      })

      if (error) {
        if (error.code === "23505") {
          setErrorMessage("Este email já está registado. Por favor use outro email.")
        } else {
          setErrorMessage("Erro ao submeter candidatura. Por favor tente novamente.")
        }
        setSubmitStatus("error")
      } else {
        setSubmitStatus("success")
        setFormData({
          name: "",
          email: "",
          phone: "",
          age: "",
          country: "Moçambique",
          province: "",
          city: "",
        })
      }
    } catch (error) {
      setErrorMessage("Erro de conexão. Por favor tente novamente.")
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <BackButton />

      {/* Hero Section */}
      <section className="pt-24 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gold/5 to-transparent" />
        <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="space-y-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 border border-gold/30 rounded-full"
            >
              <Sparkles className="w-4 h-4 text-gold" />
              <span className="text-gold text-sm">Oportunidade Exclusiva</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-light tracking-wide">
              Torne-se um <span className="text-gold">Agente</span>
            </h1>
            <p className="text-xl md:text-2xl font-light leading-relaxed text-gray-300 max-w-4xl mx-auto">
              Junte-se à rede de agentes comerciais BELLVION e transforme a sua paixão por luxo numa carreira de
              sucesso.
            </p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap justify-center gap-6 pt-4"
            >
              <div className="flex items-center gap-2 text-gray-400">
                <Users className="w-5 h-5 text-gold" />
                <span>100+ Agentes Ativos</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <TrendingUp className="w-5 h-5 text-gold" />
                <span>Crescimento Mensal</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Award className="w-5 h-5 text-gold" />
                <span>Marca Premium</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-light tracking-wide mb-4">
              Porquê Ser <span className="text-gold">Agente BELLVION</span>?
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Descubra os benefícios exclusivos de fazer parte da nossa rede de agentes comerciais.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 px-3 py-1 bg-gold/20 text-gold text-xs rounded-bl-lg">
                  {benefit.highlight}
                </div>
                <div className="text-gold mb-4 group-hover:scale-110 transition-transform">{benefit.icon}</div>
                <h3 className="text-xl font-medium mb-2">{benefit.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-light tracking-wide mb-4">
              Como <span className="text-gold">Funciona</span>?
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              O processo para se tornar um agente BELLVION é simples e rápido.
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-4 md:gap-0">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
                className="flex items-center"
              >
                <div className="text-center px-4 md:px-8">
                  <div className="w-16 h-16 rounded-full bg-gold/10 border-2 border-gold flex items-center justify-center mx-auto mb-3">
                    <span className="text-gold font-bold text-lg">{step.number}</span>
                  </div>
                  <h3 className="text-white font-medium mb-1">{step.title}</h3>
                  <p className="text-gray-500 text-xs max-w-[120px]">{step.description}</p>
                </div>
                {index < steps.length - 1 && <ArrowRight className="w-5 h-5 text-gold/50 hidden md:block" />}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-black">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-light tracking-wide mb-4">
              O Que Dizem os <span className="text-gold">Nossos Agentes</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                className="bg-gray-900 border border-gray-800 rounded-xl p-6"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                  ))}
                </div>
                <p className="text-gray-300 italic mb-4">"{testimonial.text}"</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white">{testimonial.name}</p>
                    <p className="text-gray-500 text-sm flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {testimonial.location}
                    </p>
                  </div>
                  <div className="px-3 py-1 bg-gold/10 text-gold text-xs rounded-full">{testimonial.sales}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section id="form" className="py-20 bg-gradient-to-t from-gray-900 to-black">
        <div className="max-w-2xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-light tracking-wide mb-4">
              <span className="text-gold">Candidate-se</span> Agora
            </h2>
            <p className="text-gray-400">
              Preencha o formulário abaixo e dê o primeiro passo para se tornar um agente BELLVION.
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {submitStatus === "success" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-green-900/30 border border-green-500/50 rounded-xl p-8 text-center"
              >
                <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-2xl font-medium text-white mb-2">Candidatura Enviada!</h3>
                <p className="text-gray-300 mb-6">
                  Obrigado pelo seu interesse em ser agente BELLVION. A nossa equipa irá analisar a sua candidatura e
                  entrar em contacto em breve.
                </p>
                <button
                  onClick={() => setSubmitStatus("idle")}
                  className="px-6 py-3 border border-gold text-gold hover:bg-gold hover:text-black transition-all duration-300 rounded-lg"
                >
                  Enviar Nova Candidatura
                </button>
              </motion.div>
            ) : (
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                onSubmit={handleSubmit}
                className="bg-gray-900/50 border border-gray-800 rounded-xl p-8 space-y-6"
              >
                {submitStatus === "error" && (
                  <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4 text-red-300 text-sm">
                    {errorMessage}
                  </div>
                )}

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold transition-colors"
                    placeholder="O seu nome completo"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold transition-colors"
                    placeholder="seu.email@exemplo.com"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Número de Celular *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold transition-colors"
                    placeholder="+258 84 XXX XXXX"
                  />
                </div>

                {/* Age */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Idade *
                  </label>
                  <input
                    type="number"
                    required
                    min="18"
                    max="100"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold transition-colors"
                    placeholder="Sua idade (mínimo 18 anos)"
                  />
                </div>

                {/* Country */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Globe className="w-4 h-4 inline mr-2" />
                    País *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold transition-colors"
                    placeholder="Moçambique"
                  />
                </div>

                {/* Province */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    Província *
                  </label>
                  <select
                    required
                    value={formData.province}
                    onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-gold transition-colors"
                  >
                    <option value="">Selecione a sua província</option>
                    {provinces.map((province) => (
                      <option key={province} value={province}>
                        {province}
                      </option>
                    ))}
                    <option value="Outra">Outra</option>
                  </select>
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    Cidade (Opcional)
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold transition-colors"
                    placeholder="Cidade ou localidade"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-gold text-black font-medium rounded-lg hover:bg-white transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />A enviar...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Enviar Candidatura
                    </>
                  )}
                </button>

                <p className="text-center text-gray-500 text-xs">
                  Ao submeter, concorda com os nossos termos e condições.
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-12 bg-gray-900 border-t border-gray-800">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-gray-400 mb-4">Tem dúvidas sobre o programa de agentes?</p>
          <a
            href="https://wa.me/258877347887?text=Olá! Tenho dúvidas sobre o programa de agentes BELLVION."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 border border-gold/50 text-gold hover:bg-gold hover:text-black transition-all duration-300 rounded-lg"
          >
            <Phone className="w-4 h-4" />
            Fale Connosco via WhatsApp
          </a>
        </div>
      </section>
    </div>
  )
}
