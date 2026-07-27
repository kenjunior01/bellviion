"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { createClient } from "@/lib/supabase/client"
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  TrendingUp,
  Package,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  LogOut,
  Loader2,
  ShoppingBag,
  Star,
  Award,
} from "lucide-react"
import Link from "next/link"

interface Agent {
  id: string
  name: string
  email: string
  phone: string
  age: number
  country: string
  province: string
  city: string | null
  status: string
  commission_rate: number
  total_sales: number
  created_at: string
}

interface Product {
  id: string
  name: string
  price: number
  image_url: string
}

export default function AgentDashboard() {
  const [agent, setAgent] = useState<Agent | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [loginMode, setLoginMode] = useState(true)
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    // Check if agent is logged in via localStorage
    const savedAgent = localStorage.getItem("bellvion_agent")
    if (savedAgent) {
      const agentData = JSON.parse(savedAgent)
      verifyAgent(agentData.email, agentData.phone)
    } else {
      setLoading(false)
    }
    loadProducts()
  }, [])

  const loadProducts = async () => {
    const supabase = createClient()
    const { data } = await supabase.from("products").select("id, name, price, image_url").eq("is_active", true)
    if (data) setProducts(data)
  }

  const verifyAgent = async (agentEmail: string, agentPhone: string) => {
    setLoading(true)
    setError("")

    const supabase = createClient()
    const { data, error: fetchError } = await supabase
      .from("agents")
      .select("*")
      .eq("email", agentEmail)
      .eq("phone", agentPhone)
      .single()

    if (fetchError || !data) {
      setError("Credenciais inválidas. Verifique o email e telefone.")
      localStorage.removeItem("bellvion_agent")
      setLoading(false)
      return
    }

    if (data.status !== "approved") {
      if (data.status === "pending") {
        setError("A sua candidatura ainda está em análise. Aguarde a aprovação.")
      } else if (data.status === "rejected") {
        setError("A sua candidatura foi rejeitada. Entre em contacto para mais informações.")
      } else if (data.status === "suspended") {
        setError("A sua conta está suspensa. Entre em contacto para mais informações.")
      }
      localStorage.removeItem("bellvion_agent")
      setLoading(false)
      return
    }

    setAgent(data)
    localStorage.setItem("bellvion_agent", JSON.stringify({ email: agentEmail, phone: agentPhone }))
    setLoading(false)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    await verifyAgent(email, phone)
  }

  const handleLogout = () => {
    localStorage.removeItem("bellvion_agent")
    setAgent(null)
    setEmail("")
    setPhone("")
  }

  const generateWhatsAppLink = (product: Product) => {
    const message = encodeURIComponent(
      `Olá! Sou ${agent?.name}, agente BELLVION.\n\n` +
        `Gostaria de apresentar o produto:\n` +
        `*${product.name}*\n` +
        `Preço: ${product.price.toLocaleString("pt-MZ")} MT\n\n` +
        `Interessado(a)?`,
    )
    return `https://wa.me/?text=${message}`
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-5 h-5 text-green-400" />
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-400" />
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-400" />
      case "suspended":
        return <AlertCircle className="w-5 h-5 text-orange-400" />
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-gold animate-spin" />
      </div>
    )
  }

  // Login Screen
  if (!agent) {
    return (
      <div className="min-h-screen bg-black text-white">
        {/* Background */}
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-black to-black" />
        </div>

        {/* Back Button */}
        <Link
          href="/"
          className="fixed top-6 left-6 z-50 p-3 bg-black/50 backdrop-blur-sm border border-gray-800 rounded-full hover:border-gold transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </Link>

        <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-light tracking-wider mb-2">
                <span className="text-gold">BELLVION</span> AGENTES
              </h1>
              <p className="text-gray-400">Painel do Agente Comercial</p>
            </div>

            <form onSubmit={handleLogin} className="bg-gray-900/50 border border-gray-800 rounded-xl p-8 space-y-6">
              {error && (
                <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4 text-red-300 text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-gold transition-colors"
                  placeholder="seu.email@exemplo.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Telefone
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-gold transition-colors"
                  placeholder="+258 84 XXX XXXX"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gold text-black font-medium rounded-lg hover:bg-white transition-all duration-300"
              >
                Entrar
              </button>

              <p className="text-center text-gray-500 text-sm">
                Ainda não é agente?{" "}
                <Link href="/ascend" className="text-gold hover:underline">
                  Candidate-se aqui
                </Link>
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    )
  }

  // Agent Dashboard
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-black to-black" />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 hover:bg-gray-800 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-lg font-light tracking-wider">
                <span className="text-gold">BELLVION</span> AGENTE
              </h1>
              <p className="text-xs text-gray-400">{agent.name}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-gold/20 to-transparent border border-gold/30 rounded-xl p-6 mb-8"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center">
                <Award className="w-8 h-8 text-gold" />
              </div>
              <div>
                <h2 className="text-2xl font-light">Bem-vindo, {agent.name.split(" ")[0]}!</h2>
                <p className="text-gray-400">Agente Comercial BELLVION</p>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-900/50 border border-gray-800 rounded-xl p-4"
            >
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="w-5 h-5 text-gold" />
                <span className="text-gray-400 text-sm">Vendas Totais</span>
              </div>
              <p className="text-2xl font-light">{agent.total_sales.toLocaleString("pt-MZ")} MT</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-900/50 border border-gray-800 rounded-xl p-4"
            >
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <span className="text-gray-400 text-sm">Comissão</span>
              </div>
              <p className="text-2xl font-light">{agent.commission_rate}%</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-900/50 border border-gray-800 rounded-xl p-4"
            >
              <div className="flex items-center gap-3 mb-2">
                <Package className="w-5 h-5 text-blue-400" />
                <span className="text-gray-400 text-sm">Produtos</span>
              </div>
              <p className="text-2xl font-light">{products.length}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gray-900/50 border border-gray-800 rounded-xl p-4"
            >
              <div className="flex items-center gap-3 mb-2">
                <Star className="w-5 h-5 text-yellow-400" />
                <span className="text-gray-400 text-sm">Status</span>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(agent.status)}
                <span className="text-lg capitalize">{agent.status === "approved" ? "Ativo" : agent.status}</span>
              </div>
            </motion.div>
          </div>

          {/* Agent Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 mb-8"
          >
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-gold" />
              Informações do Agente
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 text-gray-300">
                <Mail className="w-4 h-4 text-gray-500" />
                <span>{agent.email}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Phone className="w-4 h-4 text-gray-500" />
                <span>{agent.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span>
                  {agent.city ? `${agent.city}, ` : ""}
                  {agent.province}, {agent.country}
                </span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span>Membro desde {new Date(agent.created_at).toLocaleDateString("pt-MZ")}</span>
              </div>
            </div>
          </motion.div>

          {/* Products to Sell */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-gold" />
              Produtos para Vender
            </h3>
            <p className="text-gray-400 text-sm mb-6">Partilhe estes produtos com os seus clientes via WhatsApp</p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden"
                >
                  <div className="aspect-square bg-gray-800">
                    <img
                      src={product.image_url || "/placeholder.svg?height=300&width=300&query=luxury product"}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="font-medium text-white mb-1">{product.name}</h4>
                    <p className="text-gold font-medium mb-3">{product.price.toLocaleString("pt-MZ")} MT</p>
                    <a
                      href={generateWhatsAppLink(product)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full py-2 bg-green-600 text-white text-center text-sm rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Partilhar no WhatsApp
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
