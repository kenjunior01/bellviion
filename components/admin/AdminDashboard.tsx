"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard,
  Package,
  Users,
  FolderOpen,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  Menu,
  Loader2,
  Eye,
  EyeOff,
  Phone,
  Mail,
  MapPin,
  Calendar,
  MessageCircle,
  DollarSign,
  UserCheck,
  UserX,
  Pause,
} from "lucide-react"
import { ImageUpload } from "./ImageUpload"

// UI Components (assuming they are available or imported from a library like shadcn/ui)
// These are placeholders for the actual components used in the updates.
// You might need to adjust imports based on your project structure.
const Button = ({ children, onClick, className, variant }: any) => (
  <button onClick={onClick} className={`rounded-md px-4 py-2 ${className}`}>
    {children}
  </button>
)
const Input = ({ value, onChange, className, placeholder, type }: any) => (
  <input
    type={type || "text"}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`rounded-md px-4 py-3 border focus:outline-none focus:ring-2 focus:ring-gold/50 ${className}`}
  />
)
const Label = ({ children, className }: any) => (
  <label className={`block text-sm font-medium ${className}`}>{children}</label>
)
const Badge = ({ children, className }: any) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
    {children}
  </span>
)

// Types
interface Category {
  id: string
  name: string
  description: string | null
  icon: string | null
  created_at: string
}

interface Product {
  id: string
  name: string
  artistic_name: string | null
  description: string | null
  price: number
  category_id: string | null
  image_url: string | null
  specs: Record<string, string>
  is_active: boolean
  stock: number
  created_at: string
  category?: Category | null
}

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
  notes: string | null
  created_at: string
}

interface CustomRequest {
  id: string
  name: string
  email: string
  product_interest: string | null
  personalization: string | null
  placement: string | null
  purpose: string | null
  status: string
  created_at: string
}

type Tab = "dashboard" | "products" | "categories" | "agents" | "requests"

// Modal Component for Categories
const CategoryModal = ({
  category,
  isOpen,
  onClose,
  onSave,
}: {
  category: Partial<Category> | null
  isOpen: boolean
  onClose: () => void
  onSave: (data: Partial<Category>) => void
}) => {
  const [name, setName] = useState(category?.name || "")
  const [description, setDescription] = useState(category?.description || "")

  useEffect(() => {
    setName(category?.name || "")
    setDescription(category?.description || "")
  }, [category])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gray-900 border border-gold/20 rounded-2xl max-w-md w-full p-8"
      >
        <h2 className="text-2xl font-light mb-6">{category ? "Editar Categoria" : "Nova Categoria"}</h2>
        <div className="space-y-4">
          <div>
            <Label className="text-gray-400">Nome da Categoria</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-gray-800 border-gray-700"
              placeholder="Ex: Óculos"
            />
          </div>
          <div>
            <Label className="text-gray-400">Descrição (Opcional)</Label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-gray-800 border-gray-700 rounded-lg p-3 text-sm focus:outline-none focus:border-gold"
              placeholder="Breve descrição da categoria"
              rows={3}
            />
          </div>
        </div>
        <div className="flex gap-4 mt-8">
          <Button variant="outline" onClick={onClose} className="flex-1 border-gray-700 text-gray-400 bg-transparent">
            Cancelar
          </Button>
          <Button onClick={() => onSave({ name, description })} className="flex-1 bg-gold text-black hover:bg-white">
            Guardar
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

// Modal Component for Agents
const AgentModal = ({
  agent,
  isOpen,
  onClose,
  onUpdateStatus,
  onUpdateCommission,
}: {
  agent: Agent | null
  isOpen: boolean
  onClose: () => void
  onUpdateStatus: (id: string, status: string) => void
  onUpdateCommission: (id: string, rate: number) => void
}) => {
  const [commission, setCommission] = useState(agent?.commission_rate || 10)

  useEffect(() => {
    setCommission(agent?.commission_rate || 10)
  }, [agent])

  if (!isOpen || !agent) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gray-900 border border-gold/20 rounded-2xl max-w-lg w-full p-8"
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-light">{agent.name}</h2>
            <p className="text-gold text-sm">Agente Comercial</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="space-y-1">
            <p className="text-xs text-gray-500 uppercase tracking-widest">Email</p>
            <p className="text-sm">{agent.email}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-gray-500 uppercase tracking-widest">Telefone</p>
            <p className="text-sm">{agent.phone}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-gray-500 uppercase tracking-widest">Localização</p>
            <p className="text-sm">
              {agent.province}, {agent.country}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-gray-500 uppercase tracking-widest">Status Atual</p>
            <Badge
              className={
                agent.status === "approved"
                  ? "bg-green-600/20 text-green-400"
                  : agent.status === "pending"
                    ? "bg-yellow-600/20 text-yellow-400"
                    : "bg-red-600/20 text-red-400"
              }
            >
              {agent.status}
            </Badge>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <Label className="text-gray-400 mb-2 block">Taxa de Comissão (%)</Label>
            <div className="flex gap-4">
              <Input
                type="number"
                value={commission}
                onChange={(e) => setCommission(Number(e.target.value))}
                className="bg-gray-800 border-gray-700"
              />
              <Button
                onClick={() => onUpdateCommission(agent.id, commission)}
                className="bg-gray-800 hover:bg-gray-700 text-white"
              >
                Atualizar
              </Button>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-800">
            <p className="text-gray-400 mb-4 text-sm">Ações de Status</p>
            <div className="flex gap-2">
              {agent.status !== "approved" && (
                <Button
                  onClick={() => onUpdateStatus(agent.id, "approved")}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  Aprovar
                </Button>
              )}
              {agent.status !== "suspended" && agent.status === "approved" && (
                <Button
                  onClick={() => onUpdateStatus(agent.id, "suspended")}
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
                >
                  Suspender
                </Button>
              )}
              {agent.status === "pending" && (
                <Button
                  onClick={() => onUpdateStatus(agent.id, "rejected")}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  Rejeitar
                </Button>
              )}
            </div>
          </div>

          <Button
            onClick={() => window.open(`https://wa.me/${agent.phone.replace(/\D/g, "")}`, "_blank")}
            className="w-full bg-green-600 text-white hover:bg-green-700 mt-4"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Contactar via WhatsApp
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard")
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [agents, setAgents] = useState<Agent[]>([])
  const [requests, setRequests] = useState<CustomRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Modal states
  const [showProductModal, setShowProductModal] = useState(false)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [showAgentModal, setShowAgentModal] = useState(false)
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [selectedRequest, setSelectedRequest] = useState<CustomRequest | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    const supabase = createClient()

    const [prodRes, catRes, agentRes, reqRes] = await Promise.all([
      supabase.from("products").select("*, category:categories(*)").order("created_at", { ascending: false }),
      supabase.from("categories").select("*").order("name"),
      supabase.from("agents").select("*").order("created_at", { ascending: false }),
      supabase.from("requests").select("*").order("created_at", { ascending: false }),
    ])

    if (prodRes.data) setProducts(prodRes.data)
    if (catRes.data) setCategories(catRes.data)
    if (agentRes.data) setAgents(agentRes.data)
    if (reqRes.data) setRequests(reqRes.data)

    setLoading(false)
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = "/auth/login"
  }

  // Product functions
  const saveProduct = async (productData: Partial<Product>) => {
    const supabase = createClient()

    if (editingProduct) {
      await supabase.from("products").update(productData).eq("id", editingProduct.id)
    } else {
      await supabase.from("products").insert(productData)
    }

    setShowProductModal(false)
    setEditingProduct(null)
    loadData()
  }

  const deleteProduct = async (id: string) => {
    if (!confirm("Tem certeza que deseja eliminar este produto?")) return
    const supabase = createClient()
    await supabase.from("products").delete().eq("id", id)
    loadData()
  }

  const toggleProductActive = async (product: Product) => {
    const supabase = createClient()
    await supabase.from("products").update({ is_active: !product.is_active }).eq("id", product.id)
    loadData()
  }

  // Category functions
  const saveCategory = async (categoryData: Partial<Category>) => {
    const supabase = createClient()

    if (editingCategory) {
      await supabase.from("categories").update(categoryData).eq("id", editingCategory.id)
    } else {
      await supabase.from("categories").insert(categoryData)
    }

    setShowCategoryModal(false)
    setEditingCategory(null)
    loadData()
  }

  const deleteCategory = async (id: string) => {
    if (!confirm("Tem certeza que deseja eliminar esta categoria?")) return
    const supabase = createClient()
    await supabase.from("categories").delete().eq("id", id)
    loadData()
  }

  // Agent functions
  const updateAgentStatus = async (agentId: string, status: string) => {
    const supabase = createClient()
    await supabase.from("agents").update({ status }).eq("id", agentId)
    // No need to close modal or reset selectedAgent here, as it's handled by the caller
    loadData()
  }

  const updateAgentCommission = async (agentId: string, commission_rate: number) => {
    const supabase = createClient()
    await supabase.from("agents").update({ commission_rate }).eq("id", agentId)
    loadData()
  }

  const deleteAgent = async (id: string) => {
    if (!confirm("Tem certeza que deseja eliminar este agente?")) return
    const supabase = createClient()
    await supabase.from("agents").delete().eq("id", id)
    setShowAgentModal(false) // Close the modal after deletion
    setSelectedAgent(null) // Clear selected agent
    loadData()
  }

  // Request functions
  const updateRequestStatus = async (id: string, status: string) => {
    const supabase = createClient()
    await supabase.from("requests").update({ status }).eq("id", id)
    loadData()
  }

  const deleteRequest = async (id: string) => {
    if (!confirm("Tem certeza que deseja eliminar este pedido?")) return
    const supabase = createClient()
    await supabase.from("requests").delete().eq("id", id)
    loadData()
  }

  // Stats
  const stats = {
    totalProducts: products.length,
    activeProducts: products.filter((p) => p.is_active).length,
    totalCategories: categories.length,
    totalAgents: agents.length,
    pendingAgents: agents.filter((a) => a.status === "pending").length,
    approvedAgents: agents.filter((a) => a.status === "approved").length,
    totalSales: agents.reduce((sum, a) => sum + (a.total_sales || 0), 0),
    totalRequests: requests.length,
    pendingRequests: requests.filter((r) => r.status === "pending").length,
    approvedRequests: requests.filter((r) => r.status === "approved").length,
  }

  const menuItems = [
    { id: "dashboard" as Tab, label: "Dashboard", icon: LayoutDashboard },
    { id: "products" as Tab, label: "Produtos", icon: Package },
    { id: "categories" as Tab, label: "Categorias", icon: FolderOpen },
    { id: "agents" as Tab, label: "Agentes", icon: Users },
    { id: "requests" as Tab, label: "Pedidos", icon: MessageCircle },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-gold animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-64 bg-gray-900 border-r border-gray-800 flex-col">
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-xl font-light tracking-wider">
            <span className="text-gold">BELLVION</span> ADMIN
          </h1>
        </div>
        <nav className="flex-1 p-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all ${
                activeTab === item.id ? "bg-gold/20 text-gold" : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
              {item.id === "agents" && stats.pendingAgents > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {stats.pendingAgents}
                </span>
              )}
              {item.id === "requests" && stats.pendingRequests > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {stats.pendingRequests}
                </span>
              )}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Terminar Sessão
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-gray-900 border-b border-gray-800">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-lg font-light">
            <span className="text-gold">BELLVION</span> ADMIN
          </h1>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-800 rounded-lg">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-64 bg-gray-900 z-50"
            >
              <div className="p-6 border-b border-gray-800">
                <h1 className="text-xl font-light tracking-wider">
                  <span className="text-gold">BELLVION</span> ADMIN
                </h1>
              </div>
              <nav className="p-4">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id)
                      setSidebarOpen(false)
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all ${
                      activeTab === item.id ? "bg-gold/20 text-gold" : "text-gray-400 hover:bg-gray-800"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </button>
                ))}
              </nav>
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-red-400"
                >
                  <LogOut className="w-5 h-5" />
                  Terminar Sessão
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 lg:p-8 p-4 pt-20 lg:pt-8 overflow-auto">
        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div>
            <h2 className="text-2xl font-light mb-6">Dashboard</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Package className="w-5 h-5 text-gold" />
                  <span className="text-gray-400 text-sm">Produtos</span>
                </div>
                <p className="text-3xl font-light">{stats.totalProducts}</p>
                <p className="text-green-400 text-sm mt-1">{stats.activeProducts} ativos</p>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <FolderOpen className="w-5 h-5 text-blue-400" />
                  <span className="text-gray-400 text-sm">Categorias</span>
                </div>
                <p className="text-3xl font-light">{stats.totalCategories}</p>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-5 h-5 text-purple-400" />
                  <span className="text-gray-400 text-sm">Agentes</span>
                </div>
                <p className="text-3xl font-light">{stats.totalAgents}</p>
                <p className="text-yellow-400 text-sm mt-1">{stats.pendingAgents} pendentes</p>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <DollarSign className="w-5 h-5 text-green-400" />
                  <span className="text-gray-400 text-sm">Vendas</span>
                </div>
                <p className="text-3xl font-light">{stats.totalSales.toLocaleString("pt-MZ")}</p>
                <p className="text-gray-400 text-sm mt-1">MT</p>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <MessageCircle className="w-5 h-5 text-green-400" />
                  <span className="text-gray-400 text-sm">Pedidos</span>
                </div>
                <p className="text-3xl font-light">{stats.totalRequests}</p>
                <p className="text-yellow-400 text-sm mt-1">{stats.pendingRequests} pendentes</p>
              </div>
            </div>

            {/* Recent Agents */}
            {stats.pendingAgents > 0 && (
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-gold" />
                  Agentes Pendentes ({stats.pendingAgents})
                </h3>
                <div className="space-y-3">
                  {agents
                    .filter((a) => a.status === "pending")
                    .slice(0, 5)
                    .map((agent) => (
                      <div key={agent.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                        <div>
                          <p className="font-medium">{agent.name}</p>
                          <p className="text-sm text-gray-400">{agent.email}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateAgentStatus(agent.id, "approved")}
                            className="p-2 bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => updateAgentStatus(agent.id, "rejected")}
                            className="p-2 bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Recent Requests */}
            {stats.pendingRequests > 0 && (
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-gold" />
                  Pedidos Pendentes ({stats.pendingRequests})
                </h3>
                <div className="space-y-3">
                  {requests
                    .filter((r) => r.status === "pending")
                    .slice(0, 5)
                    .map((request) => (
                      <div key={request.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                        <div>
                          <p className="font-medium">{request.name}</p>
                          <p className="text-sm text-gray-400">{request.email}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateRequestStatus(request.id, "approved")}
                            className="p-2 bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => updateRequestStatus(request.id, "rejected")}
                            className="p-2 bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Products Tab */}
        {activeTab === "products" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-light">Produtos</h2>
              <button
                onClick={() => {
                  setEditingProduct(null)
                  setShowProductModal(true)
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gold text-black rounded-lg hover:bg-white transition-colors"
              >
                <Plus className="w-4 h-4" />
                Novo Produto
              </button>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className={`bg-gray-900 border rounded-xl overflow-hidden ${
                    product.is_active ? "border-gray-800" : "border-red-500/30 opacity-60"
                  }`}
                >
                  <div className="aspect-square bg-gray-800 relative">
                    <img
                      src={product.image_url || "/placeholder.svg?height=300&width=300"}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    {!product.is_active && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-red-400 font-medium">Inativo</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-white mb-1">{product.name}</h3>
                    {product.category && <p className="text-xs text-gray-500 mb-2">{product.category.name}</p>}
                    <p className="text-gold font-medium mb-3">{product.price.toLocaleString("pt-MZ")} MT</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingProduct(product)
                          setShowProductModal(true)
                        }}
                        className="flex-1 flex items-center justify-center gap-1 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                      >
                        <Edit className="w-3 h-3" />
                        Editar
                      </button>
                      <button
                        onClick={() => toggleProductActive(product)}
                        className={`p-2 rounded-lg transition-colors ${
                          product.is_active ? "bg-gray-800 hover:bg-gray-700" : "bg-green-600 hover:bg-green-700"
                        }`}
                      >
                        {product.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="p-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600 hover:text-white transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === "categories" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-light">Categorias</h2>
              <button
                onClick={() => {
                  setEditingCategory(null)
                  setShowCategoryModal(true)
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gold text-black rounded-lg hover:bg-white transition-colors"
              >
                <Plus className="w-4 h-4" />
                Nova Categoria
              </button>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => (
                <div key={category.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">{category.name}</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingCategory(category)
                          setShowCategoryModal(true)
                        }}
                        className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteCategory(category.id)}
                        className="p-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600 hover:text-white transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm mb-2">{category.description || "Sem descrição"}</p>
                  <p className="text-gray-500 text-xs">
                    {products.filter((p) => p.category_id === category.id).length} produtos
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Agents Tab */}
        {activeTab === "agents" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-light">Agentes Comerciais</h2>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-green-600/20 text-green-400 rounded-full text-sm">
                  {stats.approvedAgents} ativos
                </span>
                <span className="px-3 py-1 bg-yellow-600/20 text-yellow-400 rounded-full text-sm">
                  {stats.pendingAgents} pendentes
                </span>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left p-4 text-gray-400 font-medium">Nome</th>
                      <th className="text-left p-4 text-gray-400 font-medium hidden md:table-cell">Contacto</th>
                      <th className="text-left p-4 text-gray-400 font-medium hidden lg:table-cell">Localização</th>
                      <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                      <th className="text-left p-4 text-gray-400 font-medium">Comissão</th>
                      <th className="text-right p-4 text-gray-400 font-medium">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agents.map((agent) => (
                      <tr key={agent.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                        <td className="p-4">
                          <p className="font-medium">{agent.name}</p>
                          <p className="text-xs text-gray-500">{agent.age} anos</p>
                        </td>
                        <td className="p-4 hidden md:table-cell">
                          <p className="text-sm text-gray-300">{agent.email}</p>
                          <p className="text-xs text-gray-500">{agent.phone}</p>
                        </td>
                        <td className="p-4 hidden lg:table-cell">
                          <p className="text-sm text-gray-300">{agent.province}</p>
                          <p className="text-xs text-gray-500">{agent.country}</p>
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              agent.status === "approved"
                                ? "bg-green-600/20 text-green-400"
                                : agent.status === "pending"
                                  ? "bg-yellow-600/20 text-yellow-400"
                                  : agent.status === "rejected"
                                    ? "bg-red-600/20 text-red-400"
                                    : "bg-orange-600/20 text-orange-400"
                            }`}
                          >
                            {agent.status === "approved"
                              ? "Ativo"
                              : agent.status === "pending"
                                ? "Pendente"
                                : agent.status === "rejected"
                                  ? "Rejeitado"
                                  : "Suspenso"}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-gold">{agent.commission_rate}%</span>
                        </td>
                        <td className="p-4">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => {
                                setSelectedAgent(agent)
                                setShowAgentModal(true)
                              }}
                              className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {agent.status === "pending" && (
                              <>
                                <button
                                  onClick={() => updateAgentStatus(agent.id, "approved")}
                                  className="p-2 bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => updateAgentStatus(agent.id, "rejected")}
                                  className="p-2 bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Requests Tab */}
        {activeTab === "requests" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-light">Pedidos</h2>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-green-600/20 text-green-400 rounded-full text-sm">
                  {stats.approvedRequests} aprovados
                </span>
                <span className="px-3 py-1 bg-yellow-600/20 text-yellow-400 rounded-full text-sm">
                  {stats.pendingRequests} pendentes
                </span>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left p-4 text-gray-400 font-medium">Nome</th>
                      <th className="text-left p-4 text-gray-400 font-medium hidden md:table-cell">Email</th>
                      <th className="text-left p-4 text-gray-400 font-medium hidden lg:table-cell">
                        Produto de Interesse
                      </th>
                      <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                      <th className="text-right p-4 text-gray-400 font-medium">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((request) => (
                      <tr key={request.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                        <td className="p-4">
                          <p className="font-medium">{request.name}</p>
                        </td>
                        <td className="p-4 hidden md:table-cell">
                          <p className="text-sm text-gray-300">{request.email}</p>
                        </td>
                        <td className="p-4 hidden lg:table-cell">
                          <p className="text-sm text-gray-300">{request.product_interest}</p>
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              request.status === "approved"
                                ? "bg-green-600/20 text-green-400"
                                : request.status === "pending"
                                  ? "bg-yellow-600/20 text-yellow-400"
                                  : request.status === "rejected"
                                    ? "bg-red-600/20 text-red-400"
                                    : "bg-orange-600/20 text-orange-400"
                            }`}
                          >
                            {request.status === "approved"
                              ? "Aprovado"
                              : request.status === "pending"
                                ? "Pendente"
                                : request.status === "rejected"
                                  ? "Rejeitado"
                                  : "Suspenso"}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => {
                                setSelectedRequest(request)
                                setShowRequestModal(true)
                              }}
                              className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {request.status === "pending" && (
                              <>
                                <button
                                  onClick={() => updateRequestStatus(request.id, "approved")}
                                  className="p-2 bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => updateRequestStatus(request.id, "rejected")}
                                  className="p-2 bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Product Modal */}
      <AnimatePresence>
        {showProductModal && (
          <Modal onClose={() => setShowProductModal(false)} title={editingProduct ? "Editar PRODUCTO" : "Novo Produto"}>
            <ProductForm
              product={editingProduct}
              categories={categories}
              onSave={saveProduct}
              onCancel={() => setShowProductModal(false)}
            />
          </Modal>
        )}
      </AnimatePresence>

      {/* Category Modal */}
      <AnimatePresence>
        {showCategoryModal && (
          <Modal
            onClose={() => setShowCategoryModal(false)}
            title={editingCategory ? "Editar Categoria" : "Nova Categoria"}
          >
            <CategoryForm
              category={editingCategory}
              onSave={saveCategory}
              onCancel={() => setShowCategoryModal(false)}
            />
          </Modal>
        )}
      </AnimatePresence>

      {/* Agent Modal */}
      <AnimatePresence>
        {showAgentModal && selectedAgent && (
          <Modal onClose={() => setShowAgentModal(false)} title="Detalhes do Agente">
            <AgentDetails
              agent={selectedAgent}
              onUpdateStatus={updateAgentStatus}
              onUpdateCommission={updateAgentCommission}
              onDelete={deleteAgent}
              onClose={() => setShowAgentModal(false)}
            />
          </Modal>
        )}
      </AnimatePresence>

      {/* Request Modal */}
      <AnimatePresence>
        {showRequestModal && selectedRequest && (
          <Modal onClose={() => setShowRequestModal(false)} title="Detalhes do Pedido">
            <RequestDetails
              request={selectedRequest}
              onUpdateStatus={updateRequestStatus}
              onDelete={deleteRequest}
              onClose={() => setShowRequestModal(false)}
            />
          </Modal>
        )}
      </AnimatePresence>

      {/* New Category Modal Integration */}
      <CategoryModal
        category={editingCategory}
        isOpen={showCategoryModal}
        onClose={() => {
          setShowCategoryModal(false)
          setEditingCategory(null)
        }}
        onSave={saveCategory}
      />

      {/* New Agent Modal Integration */}
      <AgentModal
        agent={selectedAgent}
        isOpen={showAgentModal}
        onClose={() => {
          setShowAgentModal(false)
          setSelectedAgent(null)
        }}
        onUpdateStatus={updateAgentStatus}
        onUpdateCommission={updateAgentCommission}
      />
    </div>
  )
}

// Modal Component (Generic)
function Modal({
  onClose,
  title,
  children,
}: {
  onClose: () => void
  title: string
  children: React.ReactNode
}) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/70 z-50"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg bg-gray-900 border border-gray-800 rounded-xl z-50 overflow-auto max-h-[90vh]"
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h3 className="text-lg font-medium">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </motion.div>
    </>
  )
}

// Product Form Component
function ProductForm({
  product,
  categories,
  onSave,
  onCancel,
}: {
  product: Product | null
  categories: Category[]
  onSave: (data: Partial<Product>) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    artistic_name: product?.artistic_name || "",
    description: product?.description || "",
    price: product?.price?.toString() || "",
    category_id: product?.category_id || "",
    image_url: product?.image_url || "",
    stock: product?.stock?.toString() || "0",
    is_active: product?.is_active ?? true,
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSave({
          ...formData,
          price: Number.parseFloat(formData.price),
          stock: Number.parseInt(formData.stock),
          category_id: formData.category_id || null,
        })
      }}
      className="space-y-4"
    >
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Nome *</label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-gold"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Nome Artístico</label>
        <input
          type="text"
          value={formData.artistic_name}
          onChange={(e) => setFormData({ ...formData, artistic_name: e.target.value })}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-gold"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Preço (MT) *</label>
          <input
            type="number"
            required
            min="0"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-gold"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Stock</label>
          <input
            type="number"
            min="0"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-gold"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Categoria</label>
        <select
          value={formData.category_id}
          onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-gold"
        >
          <option value="">Sem categoria</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <ImageUpload
        currentImage={formData.image_url}
        onImageChange={(url) => setFormData({ ...formData, image_url: url })}
      />

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Descrição</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-gold resize-none"
          rows={3}
        />
      </div>
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={formData.is_active}
          onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
          className="w-5 h-5 rounded"
        />
        <span className="text-sm text-gray-300">Produto ativo</span>
      </label>
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors"
        >
          Cancelar
        </button>
        <button type="submit" className="flex-1 py-3 bg-gold text-black rounded-lg hover:bg-white transition-colors">
          Guardar
        </button>
      </div>
    </form>
  )
}

// Category Form Component
function CategoryForm({
  category,
  onSave,
  onCancel,
}: {
  category: Category | null
  onSave: (data: Partial<Category>) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    name: category?.name || "",
    description: category?.description || "",
    icon: category?.icon || "",
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSave(formData)
      }}
      className="space-y-4"
    >
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Nome *</label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-gold"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Descrição</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-gold resize-none"
          rows={3}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Ícone</label>
        <input
          type="text"
          value={formData.icon}
          onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-gold"
          placeholder="glasses, watch, etc."
        />
      </div>
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors"
        >
          Cancelar
        </button>
        <button type="submit" className="flex-1 py-3 bg-gold text-black rounded-lg hover:bg-white transition-colors">
          Guardar
        </button>
      </div>
    </form>
  )
}

// Agent Details Component
function AgentDetails({
  agent,
  onUpdateStatus,
  onUpdateCommission,
  onDelete,
  onClose,
}: {
  agent: Agent
  onUpdateStatus: (id: string, status: string) => void
  onUpdateCommission: (id: string, rate: number) => void
  onDelete: (id: string) => void
  onClose: () => void
}) {
  const [commission, setCommission] = useState(agent.commission_rate.toString())

  const whatsappLink = `https://wa.me/${agent.phone.replace(/\D/g, "")}`

  return (
    <div className="space-y-6">
      {/* Agent Info */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <Mail className="w-4 h-4 text-gray-500" />
          <span className="text-gray-300">{agent.email}</span>
        </div>
        <div className="flex items-center gap-3">
          <Phone className="w-4 h-4 text-gray-500" />
          <span className="text-gray-300">{agent.phone}</span>
        </div>
        <div className="flex items-center gap-3">
          <MapPin className="w-4 h-4 text-gray-500" />
          <span className="text-gray-300">
            {agent.city ? `${agent.city}, ` : ""}
            {agent.province}, {agent.country}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className="text-gray-300">{agent.age} anos</span>
        </div>
        <div className="flex items-center gap-3">
          <DollarSign className="w-4 h-4 text-gray-500" />
          <span className="text-gray-300">Vendas: {agent.total_sales.toLocaleString("pt-MZ")} MT</span>
        </div>
      </div>

      {/* Commission */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Taxa de Comissão (%)</label>
        <div className="flex gap-2">
          <input
            type="number"
            min="0"
            max="100"
            step="0.5"
            value={commission}
            onChange={(e) => setCommission(e.target.value)}
            className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-gold"
          />
          <button
            onClick={() => onUpdateCommission(agent.id, Number.parseFloat(commission))}
            className="px-4 py-2 bg-gold text-black rounded-lg hover:bg-white transition-colors"
          >
            Atualizar
          </button>
        </div>
      </div>

      {/* WhatsApp */}
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
      >
        <MessageCircle className="w-5 h-5" />
        Contactar via WhatsApp
      </a>

      {/* Status Actions */}
      <div className="grid grid-cols-2 gap-2">
        {agent.status !== "approved" && (
          <button
            onClick={() => onUpdateStatus(agent.id, "approved")}
            className="flex items-center justify-center gap-2 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
          >
            <UserCheck className="w-4 h-4" />
            Aprovar
          </button>
        )}
        {agent.status !== "suspended" && agent.status === "approved" && (
          <button
            onClick={() => onUpdateStatus(agent.id, "suspended")}
            className="flex items-center justify-center gap-2 py-2 bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors"
          >
            <Pause className="w-4 h-4" />
            Suspender
          </button>
        )}
        {agent.status !== "rejected" && agent.status !== "approved" && (
          <button
            onClick={() => onUpdateStatus(agent.id, "rejected")}
            className="flex items-center justify-center gap-2 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
          >
            <UserX className="w-4 h-4" />
            Rejeitar
          </button>
        )}
      </div>

      {/* Delete */}
      <button
        onClick={() => onDelete(agent.id)}
        className="w-full py-2 border border-red-500 text-red-400 rounded-lg hover:bg-red-600 hover:text-white transition-colors"
      >
        Eliminar Agente
      </button>
    </div>
  )
}

// Request Details Component
function RequestDetails({
  request,
  onUpdateStatus,
  onDelete,
  onClose,
}: {
  request: CustomRequest
  onUpdateStatus: (id: string, status: string) => void
  onDelete: (id: string) => void
  onClose: () => void
}) {
  return (
    <div className="space-y-6">
      {/* Request Info */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <Mail className="w-4 h-4 text-gray-500" />
          <span className="text-gray-300">{request.email}</span>
        </div>
        <div className="flex items-center gap-3">
          <MessageCircle className="w-4 h-4 text-gray-500" />
          <span className="text-gray-300">Produto de Interesse: {request.product_interest}</span>
        </div>
        <div className="flex items-center gap-3">
          <Edit className="w-4 h-4 text-gray-500" />
          <span className="text-gray-300">Personalização: {request.personalization}</span>
        </div>
        <div className="flex items-center gap-3">
          <FolderOpen className="w-4 h-4 text-gray-500" />
          <span className="text-gray-300">Localização para Anúncio: {request.placement}</span>
        </div>
        <div className="flex items-center gap-3">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className="text-gray-300">Propósito: {request.purpose}</span>
        </div>
      </div>

      {/* Status Actions */}
      <div className="grid grid-cols-2 gap-2">
        {request.status !== "approved" && (
          <button
            onClick={() => onUpdateStatus(request.id, "approved")}
            className="flex items-center justify-center gap-2 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
          >
            <UserCheck className="w-4 h-4" />
            Aprovar
          </button>
        )}
        {request.status !== "rejected" && request.status !== "approved" && (
          <button
            onClick={() => onUpdateStatus(request.id, "rejected")}
            className="flex items-center justify-center gap-2 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
          >
            <UserX className="w-4 h-4" />
            Rejeitar
          </button>
        )}
      </div>

      {/* Delete */}
      <button
        onClick={() => onDelete(request.id)}
        className="w-full py-2 border border-red-500 text-red-400 rounded-lg hover:bg-red-600 hover:text-white transition-colors"
      >
        Eliminar Pedido
      </button>
    </div>
  )
}

export default AdminDashboard
