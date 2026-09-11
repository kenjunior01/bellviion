"use client"

import { useState, useCallback, useEffect } from "react"
import {
  Lock, LayoutDashboard, Package, ShoppingBag, Settings, Plus, Pencil, Trash2, X, LogOut,
  TrendingUp, DollarSign, Users, Eye, EyeOff, Loader2, Search, Save, Image as ImageIcon,
} from "lucide-react"
import type { Product, Order } from "@/lib/store-data"
import { CATEGORIES, formatDate } from "@/lib/store-data"
import { toast } from "sonner"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const authHeaders = (token: string) => ({ "Content-Type": "application/json", "x-admin-password": token })

// ============================================================
// ADMIN — wrapper com login
// ============================================================
export function AdminView({ onExit }: { onExit: () => void }) {
  const [token, setToken] = useState<string | null>(null)
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const login = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch("/api/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })
      if (res.ok) {
        setToken(password)
        sessionStorage.setItem("bv_admin", password)
        toast.success("Welcome back, boss! 👑")
      } else {
        toast.error("Invalid password")
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const saved = sessionStorage.getItem("bv_admin")
    if (saved) setToken(saved)
  }, [])

  if (!token) {
    return (
      <div className="max-w-md mx-auto px-4 py-20">
        <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-xl">
          <div className="w-16 h-16 bg-gradient-to-br from-slate-900 to-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Lock className="w-8 h-8 text-orange-400" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 text-center">Admin Panel</h1>
          <p className="text-sm text-gray-500 text-center mt-1 mb-6">Manage products, orders & settings</p>
          <form onSubmit={login} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin password"
              className="w-full px-4 py-3.5 text-sm bg-gray-50 rounded-xl border border-transparent focus:bg-white focus:border-orange-300 outline-none transition-all text-center"
              autoFocus
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-3.5 rounded-xl shadow-lg hover:scale-[1.01] transition-transform disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Lock className="w-4 h-4" /> Sign In</>}
            </button>
          </form>
          <p className="text-[11px] text-gray-400 text-center mt-4">
            Default password: <code className="bg-gray-100 px-1.5 py-0.5 rounded">bellviion2026</code> — change it in Settings!
          </p>
        </div>
        <button onClick={onExit} className="w-full text-center text-sm text-gray-400 hover:text-gray-600 mt-6">
          ← Back to store
        </button>
      </div>
    )
  }

  return <AdminDashboard token={token} onLogout={() => { sessionStorage.removeItem("bv_admin"); setToken(null); onExit() }} />
}

// ============================================================
// DASHBOARD principal
// ============================================================
function AdminDashboard({ token, onLogout }: { token: string; onLogout: () => void }) {
  const [tab, setTab] = useState<"overview" | "products" | "orders" | "operations" | "affiliates" | "settings">("overview")
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [affiliates, setAffiliates] = useState<Array<{ id: string; code: string; name: string; email: string; commission: number; clicks: number; sales: number; earnings: number; isActive: boolean }>>([])
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [editingProduct, setEditingProduct] = useState<Product | "new" | null>(null)
  const [mobileTabOpen, setMobileTabOpen] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [p, o, s, a] = await Promise.all([
        fetch("/api/products").then((r) => r.json()),
        fetch("/api/orders", { headers: authHeaders(token) }).then((r) => r.json()),
        fetch("/api/settings").then((r) => r.json()),
        fetch("/api/affiliate", { headers: authHeaders(token) }).then((r) => r.json()),
      ])
      setProducts(p.products || [])
      setOrders(o.orders || [])
      setSettings(s.settings || {})
      setAffiliates(a.affiliates || [])
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => { load() }, [load])

  const revenue = orders.filter((o) => o.paymentStatus === "paid").reduce((a, o) => a + o.total, 0)
  const avgMargin = products.length
    ? products.reduce((a, p) => a + (p.cost ? ((p.price - p.cost) / p.price) * 100 : 65), 0) / products.length
    : 0

  const tabs = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "products", label: `Products (${products.length})`, icon: Package },
    { id: "orders", label: `Orders (${orders.length})`, icon: ShoppingBag },
    { id: "operations", label: "Fulfillment", icon: TrendingUp },
    { id: "affiliates", label: `Affiliates (${affiliates.length})`, icon: Users },
    { id: "settings", label: "Settings", icon: Settings },
  ] as const

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Admin Dashboard 👑</h1>
          <p className="text-sm text-gray-500">Bellviion control center</p>
        </div>
        <button onClick={onLogout} className="text-sm text-gray-500 hover:text-red-500 flex items-center gap-1.5">
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 mb-8 overflow-x-auto pb-1 -mx-4 px-4">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 whitespace-nowrap px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
              tab === id ? "bg-slate-900 text-white shadow-lg" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Icon className="w-4 h-4" /> {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-orange-500" /></div>
      ) : (
        <>
          {/* ===== OVERVIEW ===== */}
          {tab === "overview" && (
            <div className="space-y-8">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Total Revenue (paid)", value: `$${revenue.toFixed(2)}`, icon: DollarSign, color: "from-emerald-500 to-teal-500" },
                  { label: "Orders", value: orders.length, icon: ShoppingBag, color: "from-orange-500 to-red-500" },
                  { label: "Active Products", value: products.filter((p) => p.isActive).length, icon: Package, color: "from-slate-700 to-slate-900" },
                  { label: "Avg. Profit Margin", value: `${avgMargin.toFixed(0)}%`, icon: TrendingUp, color: "from-fuchsia-500 to-pink-500" },
                ].map((s) => (
                  <div key={s.label} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3`}>
                      <s.icon className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-2xl font-black text-gray-900">{s.value}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Top produtos */}
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <h2 className="font-black text-gray-900 mb-4">🔥 Best Selling Products</h2>
                <div className="space-y-3">
                  {[...products].sort((a, b) => b.soldCount - a.soldCount).slice(0, 5).map((p, i) => (
                    <div key={p.id} className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${i === 0 ? "bg-amber-400 text-white" : "bg-gray-100 text-gray-500"}`}>
                        {i + 1}
                      </span>
                      <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 line-clamp-1">{p.name}</p>
                        <p className="text-xs text-gray-400">{p.soldCount.toLocaleString()} sold · {p.reviewCount.toLocaleString()} reviews</p>
                      </div>
                      <p className="text-sm font-black text-gray-900">${p.price.toFixed(2)}</p>
                      {p.cost && (
                        <p className="text-xs font-bold text-emerald-600 hidden sm:block">
                          +${(p.price - p.cost).toFixed(2)}/unit
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Pedidos recentes */}
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <h2 className="font-black text-gray-900 mb-4">📋 Recent Orders</h2>
                {orders.length === 0 ? (
                  <p className="text-sm text-gray-400">No orders yet — they&apos;ll appear here in real time.</p>
                ) : (
                  <div className="space-y-3">
                    {orders.slice(0, 5).map((o) => (
                      <div key={o.id} className="flex items-center justify-between text-sm border-b border-gray-50 pb-2">
                        <span className="font-bold text-gray-800">{o.orderNumber}</span>
                        <span className="text-gray-500">{o.country} · {formatDate(o.createdAt)}</span>
                        <span className="font-black">${o.total.toFixed(2)}</span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${o.paymentStatus === "paid" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                          {o.paymentStatus}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ===== PRODUTOS ===== */}
          {tab === "products" && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input placeholder="Search products..." className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-100 rounded-xl outline-none" />
                </div>
                <button
                  onClick={() => setEditingProduct("new")}
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg flex items-center gap-2 hover:scale-[1.02] transition-transform"
                >
                  <Plus className="w-4 h-4" /> Add Product
                </button>
              </div>

              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-left">
                      <tr>
                        <th className="px-4 py-3 font-bold text-gray-600">Product</th>
                        <th className="px-4 py-3 font-bold text-gray-600 hidden md:table-cell">Price / Cost</th>
                        <th className="px-4 py-3 font-bold text-gray-600 hidden lg:table-cell">Margin</th>
                        <th className="px-4 py-3 font-bold text-gray-600 hidden sm:table-cell">Stock</th>
                        <th className="px-4 py-3 font-bold text-gray-600">Visible</th>
                        <th className="px-4 py-3 font-bold text-gray-600 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((p) => (
                        <tr key={p.id} className="border-t border-gray-50 hover:bg-gray-50/50">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                              <div className="min-w-0">
                                <p className="font-semibold text-gray-900 line-clamp-1">{p.name}</p>
                                <p className="text-xs text-gray-400">{p.category} · {p.soldCount} sold</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 hidden md:table-cell">
                            <p className="font-bold text-gray-900">${p.price.toFixed(2)}</p>
                            {p.cost && <p className="text-xs text-gray-400">cost ${p.cost.toFixed(2)}</p>}
                          </td>
                          <td className="px-4 py-3 hidden lg:table-cell">
                            {p.cost ? (
                              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                                +{(((p.price - p.cost) / p.price) * 100).toFixed(0)}%
                              </span>
                            ) : "—"}
                          </td>
                          <td className="px-4 py-3 hidden sm:table-cell">{p.stock}</td>
                          <td className="px-4 py-3">
                            <Switch
                              checked={p.isActive}
                              onCheckedChange={async (checked) => {
                                await fetch(`/api/products/${p.id}`, {
                                  method: "PUT",
                                  headers: authHeaders(token),
                                  body: JSON.stringify({ isActive: checked }),
                                })
                                load()
                              }}
                            />
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={async () => {
                                  await fetch(`/api/products/${p.id}`, {
                                    method: "PUT",
                                    headers: authHeaders(token),
                                    body: JSON.stringify({ isTrending: !p.isTrending }),
                                  })
                                  load()
                                  toast(p.isTrending ? "Removed from homepage" : "Added to homepage trending!")
                                }}
                                className={`p-2 rounded-lg ${p.isTrending ? "text-orange-500" : "text-gray-300"}`}
                                title="Toggle homepage feature"
                              >
                                <TrendingUp className="w-4 h-4" />
                              </button>
                              <button onClick={() => setEditingProduct(p)} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100" title="Edit">
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                onClick={async () => {
                                  if (!confirm(`Delete "${p.name}"?`)) return
                                  await fetch(`/api/products/${p.id}`, { method: "DELETE", headers: authHeaders(token) })
                                  toast.success("Product deleted")
                                  load()
                                }}
                                className="p-2 rounded-lg text-red-400 hover:bg-red-50"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
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

          {/* ===== PEDIDOS ===== */}
          {tab === "orders" && (
            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center">
                  <Users className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">No orders yet</p>
                  <p className="text-sm text-gray-400 mt-1">Orders from the checkout will appear here instantly.</p>
                </div>
              ) : (
                orders.map((o) => (
                  <div key={o.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-black text-gray-900">{o.orderNumber}</p>
                        <p className="text-xs text-gray-400">{formatDate(o.createdAt)} · {o.country} · {o.currency}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${o.paymentStatus === "paid" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                          {o.paymentStatus}
                        </span>
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-50 text-slate-700">{o.status}</span>
                        <span className="font-black text-lg">${o.total.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-50 grid sm:grid-cols-2 gap-2 text-xs text-gray-500">
                      <p>👤 {o.customerName} · {o.email}</p>
                      <p>📍 {o.city}, {o.country} {o.zipCode}</p>
                      {o.referralCode && <p className="text-orange-500 font-semibold">🎁 Affiliate: {o.referralCode}</p>}
                      {o.utmSource && <p>📈 Source: {o.utmSource} / {o.utmCampaign || o.utmMedium || "—"}</p>}
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {o.items.map((item) => (
                        <span key={item.id} className="text-xs bg-gray-50 rounded-lg px-2.5 py-1.5 flex items-center gap-1.5">
                          {item.image && <img src={item.image} alt="" className="w-5 h-5 rounded object-cover" />}
                          {item.name} ×{item.quantity}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* ===== FULFILLMENT ===== */}
          {tab === "operations" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  ["To fulfill", orders.filter((o) => o.paymentStatus === "paid" && ["processing", "confirmed"].includes(o.status)).length, "bg-amber-50 text-amber-700"],
                  ["Shipped", orders.filter((o) => o.status === "shipped").length, "bg-blue-50 text-blue-700"],
                  ["Delivered", orders.filter((o) => o.status === "delivered").length, "bg-emerald-50 text-emerald-700"],
                  ["US + Canada", orders.filter((o) => ["US", "CA"].includes(o.country)).length, "bg-violet-50 text-violet-700"],
                ].map(([label, value, color]) => (
                  <div key={label} className={`rounded-2xl p-5 ${color}`}><p className="text-2xl font-black">{value}</p><p className="text-xs font-bold uppercase tracking-wide mt-1">{label}</p></div>
                ))}
              </div>
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4"><div><h2 className="font-black text-gray-900">Fulfillment queue</h2><p className="text-sm text-gray-500">Prioritize paid orders for US and Canada dispatch.</p></div><span className="text-xs font-bold bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full">Shopify-ready workflow</span></div>
                <div className="space-y-3">
                  {orders.filter((o) => o.paymentStatus === "paid" && o.status !== "delivered" && o.status !== "cancelled").map((o) => (
                    <div key={o.id} className="flex flex-wrap items-center gap-3 border-t border-gray-100 pt-3">
                      <div className="flex-1 min-w-[180px]"><p className="font-bold text-gray-900">{o.orderNumber}</p><p className="text-xs text-gray-500">{o.customerName} · {o.country} · {o.zipCode}</p></div>
                      <span className="text-xs font-semibold text-gray-500">{o.items.length} item(s)</span><span className="font-black">${o.total.toFixed(2)} {o.currency}</span><span className="text-xs font-bold bg-slate-100 px-2 py-1 rounded-full">{o.status}</span>
                    </div>
                  ))}
                  {orders.filter((o) => o.paymentStatus === "paid" && o.status !== "delivered" && o.status !== "cancelled").length === 0 && <p className="text-sm text-gray-500 py-6 text-center">No paid orders waiting for fulfillment.</p>}
                </div>
              </div>
            </div>
          )}

          {/* ===== AFFILIATES ===== */}
          {tab === "affiliates" && (
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100"><h2 className="font-black text-gray-900">Affiliate partners</h2><p className="text-sm text-gray-500">Track codes, sales and commissions.</p></div>
              <div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-gray-50"><tr><th className="p-4 text-left">Partner</th><th className="p-4 text-left">Code</th><th className="p-4 text-left">Clicks</th><th className="p-4 text-left">Sales</th><th className="p-4 text-left">Earnings</th><th className="p-4 text-left">Status</th></tr></thead><tbody>{affiliates.map((a) => <tr key={a.id} className="border-t border-gray-100"><td className="p-4"><p className="font-bold">{a.name}</p><p className="text-xs text-gray-500">{a.email}</p></td><td className="p-4 font-mono font-bold">{a.code}</td><td className="p-4">{a.clicks}</td><td className="p-4">{a.sales}</td><td className="p-4 font-bold">${a.earnings.toFixed(2)}</td><td className="p-4"><span className={`text-xs font-bold px-2 py-1 rounded-full ${a.isActive ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>{a.isActive ? "Active" : "Paused"}</span></td></tr>)}</tbody></table></div>
            </div>
          )}

          {/* ===== SETTINGS ===== */}
          {tab === "settings" && <SettingsTab token={token} settings={settings} reload={load} />}
        </>
      )}

      {/* Modal de produto */}
      {editingProduct && (
        <ProductModal
          token={token}
          product={editingProduct === "new" ? null : editingProduct}
          onClose={() => setEditingProduct(null)}
          onSaved={() => { setEditingProduct(null); load() }}
        />
      )}
    </div>
  )
}

// ============================================================
// Modal de produto (criar/editar)
// ============================================================
function ProductModal({
  token, product, onClose, onSaved,
}: {
  token: string
  product: Product | null
  onClose: () => void
  onSaved: () => void
}) {
  const isEdit = !!product
  const [saving, setSaving] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({
    name: product?.name || "",
    tagline: product?.tagline || "",
    description: product?.description || "",
    category: product?.category || "tech",
    price: product?.price?.toString() || "",
    compareAtPrice: product?.compareAtPrice?.toString() || "",
    cost: product?.cost?.toString() || "",
    image: product?.image || "",
    badge: product?.badge || "NEW",
    isTrending: product?.isTrending ?? false,
    stock: product?.stock?.toString() || "100",
    keywords: product?.keywords || "",
  })

  const update = (key: string, value: string | boolean) => setForm((f) => ({ ...f, [key]: value }))

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.price || !form.image) {
      toast.error("Name, price and image URL are required")
      return
    }
    setSaving(true)
    try {
      const res = await fetch(isEdit ? `/api/products/${product!.id}` : "/api/products", {
        method: isEdit ? "PUT" : "POST",
        headers: authHeaders(token),
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const d = await res.json()
        throw new Error(d.error || "Save failed")
      }
      toast.success(isEdit ? "Product updated ✅" : "Product added to store 🎉")
      onSaved()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-3xl z-10">
          <h2 className="font-black text-lg text-gray-900">{isEdit ? "Edit Product" : "Add New Product"}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={save} className="p-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-gray-500 uppercase">Product Name *</label>
              <input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="e.g. LED Sunset Projection Lamp" className="mt-1 w-full px-4 py-3 text-sm bg-gray-50 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-orange-200" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-gray-500 uppercase">Marketing Tagline</label>
              <input value={form.tagline} onChange={(e) => update("tagline", e.target.value)} placeholder="Transform any room into golden hour" className="mt-1 w-full px-4 py-3 text-sm bg-gray-50 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-orange-200" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-gray-500 uppercase">Description (SEO-rich) *</label>
              <textarea value={form.description} onChange={(e) => update("description", e.target.value)} rows={4} placeholder="Describe benefits, use cases... include keywords your customers search for!" className="mt-1 w-full px-4 py-3 text-sm bg-gray-50 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-orange-200" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Image URL *</label>
              <div className="relative mt-1">
                <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input value={form.image} onChange={(e) => update("image", e.target.value)} placeholder="https://... or /products/photo.png" className="w-full pl-10 pr-4 py-3 text-sm bg-gray-50 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-orange-200" />
              </div>
              {form.image && (
                <img src={form.image} alt="Preview" className="mt-2 w-20 h-20 rounded-xl object-cover border border-gray-100" />
              )}
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Category *</label>
              <Select value={form.category} onValueChange={(v) => update("category", v)}>
                <SelectTrigger className="mt-1 w-full bg-gray-50 border-0 rounded-xl py-3"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.filter((c) => c.id !== "all").map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.icon} {c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Price USD *</label>
              <input type="number" step="0.01" min="0.01" value={form.price} onChange={(e) => update("price", e.target.value)} placeholder="24.99" className="mt-1 w-full px-4 py-3 text-sm bg-gray-50 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-orange-200" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Compare-at Price (anchor)</label>
              <input type="number" step="0.01" min="0" value={form.compareAtPrice} onChange={(e) => update("compareAtPrice", e.target.value)} placeholder="49.99" className="mt-1 w-full px-4 py-3 text-sm bg-gray-50 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-orange-200" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Supplier Cost (private)</label>
              <div className="relative mt-1">
                <input type={showPassword ? "number" : "password"} step="0.01" min="0" value={form.cost} onChange={(e) => update("cost", e.target.value)} placeholder="6.50" className="w-full px-4 py-3 pr-10 text-sm bg-gray-50 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-orange-200" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" aria-label="Toggle cost visibility">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Stock</label>
              <input type="number" min="0" value={form.stock} onChange={(e) => update("stock", e.target.value)} className="mt-1 w-full px-4 py-3 text-sm bg-gray-50 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-orange-200" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Viral Badge</label>
              <Select value={form.badge} onValueChange={(v) => update("badge", v)}>
                <SelectTrigger className="mt-1 w-full bg-gray-50 border-0 rounded-xl py-3"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["NEW", "VIRAL", "BESTSELLER", "TRENDING", "SUMMER HOT"].map((b) => (
                    <SelectItem key={b} value={b}>{b}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-gray-500 uppercase">SEO Keywords (comma-separated)</label>
              <input value={form.keywords} onChange={(e) => update("keywords", e.target.value)} placeholder="sunset lamp, tiktok lamp, room decor, gift ideas" className="mt-1 w-full px-4 py-3 text-sm bg-gray-50 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-orange-200" />
            </div>
            <div className="sm:col-span-2 flex items-center justify-between bg-orange-50 border border-orange-100 rounded-xl px-4 py-3">
              <div>
                <p className="text-sm font-bold text-gray-900">Feature on homepage 🔥</p>
                <p className="text-xs text-gray-500">Trending products appear in the &quot;Trending Right Now&quot; section</p>
              </div>
              <Switch checked={form.isTrending} onCheckedChange={(v) => update("isTrending", v)} />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 border-2 border-gray-200 text-gray-700 font-bold py-3.5 rounded-xl hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-3.5 rounded-xl shadow-lg disabled:opacity-60 flex items-center justify-center gap-2">
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-4 h-4" /> {isEdit ? "Save Changes" : "Add Product"}</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ============================================================
// Settings tab
// ============================================================
function SettingsTab({ token, settings, reload }: { token: string; settings: Record<string, string>; reload: () => void }) {
  const [form, setForm] = useState({
    paypal_client_id: settings.paypal_client_id || "",
    paypal_client_secret: settings.paypal_client_secret || "",
    paypal_mode: settings.paypal_mode || "sandbox",
    announcement: settings.announcement || "",
    admin_password: "",
    free_shipping_threshold: settings.free_shipping_threshold || "35",
    affiliate_commission: settings.affiliate_commission || "10",
  })
  const [saving, setSaving] = useState(false)

  const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }))

  const save = async () => {
    setSaving(true)
    try {
      const payload: Record<string, string> = {
        paypal_client_id: form.paypal_client_id,
        paypal_client_secret: form.paypal_client_secret,
        paypal_mode: form.paypal_mode,
        announcement: form.announcement,
        free_shipping_threshold: form.free_shipping_threshold,
        affiliate_commission: form.affiliate_commission,
      }
      if (form.admin_password) payload.admin_password = form.admin_password
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: authHeaders(token),
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error("Failed to save")
      toast.success("Settings saved ✅")
      setForm((f) => ({ ...f, admin_password: "" }))
      reload()
    } catch {
      toast.error("Failed to save settings")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* PayPal */}
      <section className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <h2 className="font-black text-gray-900 mb-1">💳 PayPal Configuration</h2>
        <p className="text-xs text-gray-400 mb-5">
          Paste your PayPal App credentials to accept <strong>real payments</strong>. Get them free at developer.paypal.com → Apps & Credentials → Create App.
        </p>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Mode</label>
            <Select value={form.paypal_mode} onValueChange={(v) => update("paypal_mode", v)}>
              <SelectTrigger className="mt-1 w-full bg-gray-50 border-0 rounded-xl py-3"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="sandbox">🧪 Sandbox (testing)</SelectItem>
                <SelectItem value="live">🚀 Live (real money)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Client ID</label>
            <input value={form.paypal_client_id} onChange={(e) => update("paypal_client_id", e.target.value)} placeholder="AXf2... (from PayPal developer dashboard)" className="mt-1 w-full px-4 py-3 text-sm bg-gray-50 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-orange-200 font-mono text-xs" />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Client Secret</label>
            <input type="password" value={form.paypal_client_secret} onChange={(e) => update("paypal_client_secret", e.target.value)} placeholder="EGnH..." className="mt-1 w-full px-4 py-3 text-sm bg-gray-50 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-orange-200 font-mono text-xs" />
          </div>
          <p className="text-[11px] bg-emerald-50 text-emerald-700 rounded-xl p-3">
            💡 In <strong>Live mode</strong>, connect PayPal to a US/EU business account for the best conversion in high-value countries. Leave empty to keep using demo mode.
          </p>
        </div>
      </section>

      {/* Store settings */}
      <section className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <h2 className="font-black text-gray-900 mb-1">🏪 Store Settings</h2>
        <p className="text-xs text-gray-400 mb-5">Announcement bar, shipping threshold & security.</p>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Announcement Bar (top of site)</label>
            <textarea value={form.announcement} onChange={(e) => update("announcement", e.target.value)} rows={2} className="mt-1 w-full px-4 py-3 text-sm bg-gray-50 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-orange-200" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Free Shipping Over (USD)</label>
              <input type="number" value={form.free_shipping_threshold} onChange={(e) => update("free_shipping_threshold", e.target.value)} className="mt-1 w-full px-4 py-3 text-sm bg-gray-50 rounded-xl outline-none" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Affiliate Commission (%)</label>
              <input type="number" value={form.affiliate_commission} onChange={(e) => update("affiliate_commission", e.target.value)} className="mt-1 w-full px-4 py-3 text-sm bg-gray-50 rounded-xl outline-none" />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Change Admin Password</label>
            <input type="password" value={form.admin_password} onChange={(e) => update("admin_password", e.target.value)} placeholder="Leave empty to keep current password" className="mt-1 w-full px-4 py-3 text-sm bg-gray-50 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-orange-200" />
          </div>
        </div>
      </section>

      <div className="lg:col-span-2">
        <button onClick={save} disabled={saving} className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg disabled:opacity-60 flex items-center gap-2">
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-4 h-4" /> Save All Settings</>}
        </button>
      </div>
    </div>
  )
}
