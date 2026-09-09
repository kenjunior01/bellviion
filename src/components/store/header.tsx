"use client"

import { useState, useEffect } from "react"
import { Search, ShoppingCart, User, Menu, X, Flame, ChevronDown, Zap } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useCart, useCurrency } from "@/lib/cart-store"
import { CURRENCIES, CATEGORIES, formatPrice } from "@/lib/store-data"
import { CountdownTimer } from "./shared"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface HeaderProps {
  onNavigate: (view: string, data?: unknown) => void
  onSearch: (query: string) => void
  flashDeadline: number
  announcement: string
  onAdminClick: () => void
}

export function StoreHeader({ onNavigate, onSearch, flashDeadline, announcement, onAdminClick }: HeaderProps) {
  const cartCount = useCart((s) => s.items.reduce((acc, i) => acc + i.quantity, 0))
  const cartTotal = useCart((s) => s.items.reduce((acc, i) => acc + i.price * i.quantity, 0))
  const currency = useCurrency((s) => s.currency)
  const setCurrency = useCurrency((s) => s.setCurrency)
  const [searchQuery, setSearchQuery] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(searchQuery)
  }

  return (
    <header className="sticky top-0 z-50">
      {/* Barra flash sale */}
      <div className="relative bg-ember text-white overflow-hidden">
        <div className="absolute inset-0 bg-[repeating-linear-gradient(-45deg,transparent,transparent_14px,rgba(0,0,0,0.08)_14px,rgba(0,0,0,0.08)_28px)]" aria-hidden />
        <div className="relative max-w-7xl mx-auto px-4 py-2 flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold">
          <Flame className="w-4 h-4 shrink-0 animate-pulse" />
          <span className="truncate">{announcement}</span>
          <span className="hidden sm:inline-flex items-center gap-1 bg-black/30 rounded px-2 py-0.5 text-xs font-mono">
            <Zap className="w-3 h-3 text-volt" /> <CountdownTimer deadline={flashDeadline} />
          </span>
        </div>
      </div>

      {/* Header principal */}
      <div className={`glass-strong transition-shadow ${scrolled ? "shadow-2xl shadow-black/40" : ""}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 h-16">
            {/* Logo */}
            <button
              onClick={() => onNavigate("home")}
              className="flex items-center gap-2 shrink-0"
              aria-label="Bellviion home"
            >
              <span className="text-xl sm:text-2xl font-black font-display tracking-tight text-white">
                BELLVII<span className="text-volt">O</span>N
              </span>
              <span className="hidden md:inline text-[9px] font-bold text-zinc-500 uppercase tracking-[0.25em] border-l border-white/10 pl-2">
                Viral Finds · Worldwide
              </span>
            </button>

            {/* Busca (desktop) */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-4" role="search">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search viral products, gadgets, gifts..."
                  className="w-full pl-11 pr-4 py-2.5 text-sm bg-white/5 rounded-full border border-white/10 text-white placeholder:text-zinc-500 focus:bg-white/10 focus:border-volt/50 focus:ring-2 focus:ring-volt/20 outline-none transition-all"
                  aria-label="Search products"
                />
              </div>
            </form>

            {/* Ações */}
            <div className="flex items-center gap-1.5 ml-auto">
              {/* Seletor de moeda */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="hidden sm:flex items-center gap-1 text-sm font-semibold px-2.5 py-2 rounded-lg hover:bg-white/5 transition-colors text-zinc-300"
                    aria-label="Change currency"
                  >
                    <span>{CURRENCIES[currency]?.flag}</span>
                    <span>{currency}</span>
                    <ChevronDown className="w-3 h-3 text-zinc-500" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-popover border-white/10">
                  {Object.entries(CURRENCIES).map(([code, c]) => (
                    <DropdownMenuItem
                      key={code}
                      onClick={() => setCurrency(code)}
                      className={code === currency ? "bg-volt/10 font-semibold text-volt" : "text-zinc-300"}
                    >
                      <span className="mr-2">{c.flag}</span> {code} — {c.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Admin */}
              <button
                onClick={onAdminClick}
                className="hidden sm:flex p-2.5 rounded-lg hover:bg-white/5 transition-colors text-zinc-400 hover:text-volt"
                aria-label="Admin panel"
                title="Admin"
              >
                <User className="w-5 h-5" />
              </button>

              {/* Carrinho */}
              <button
                onClick={() => onNavigate("cart")}
                className="relative flex items-center gap-2 bg-volt text-zinc-950 pl-3.5 pr-4 py-2 rounded-full font-black text-sm hover:glow-volt hover:scale-[1.03] active:scale-95 transition-all font-display uppercase tracking-wide"
                aria-label={`Shopping cart, ${cartCount} items`}
              >
                <ShoppingCart className="w-4 h-4" />
                <span className="hidden sm:inline">{cartCount > 0 ? formatPrice(cartTotal, currency) : "Cart"}</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-ember text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-ink">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Menu mobile */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-white/5 text-zinc-300"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Busca mobile */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="md:hidden overflow-hidden"
              >
                <div className="pb-3">
                  <form onSubmit={handleSearch} role="search">
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                      <input
                        type="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search products..."
                        className="w-full pl-11 pr-4 py-2.5 text-sm bg-white/5 rounded-full border border-white/10 text-white outline-none focus:border-volt/50"
                        aria-label="Search products"
                      />
                    </div>
                  </form>
                  <div className="flex sm:hidden gap-2 mt-3">
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="flex-1 text-sm bg-white/5 border border-white/10 rounded-lg px-3 py-2 font-semibold text-white"
                      aria-label="Currency"
                    >
                      {Object.entries(CURRENCIES).map(([code, c]) => (
                        <option key={code} value={code} className="bg-ink-2">{c.flag} {code}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => { onAdminClick(); setMobileMenuOpen(false) }}
                      className="text-sm bg-white/5 border border-white/10 rounded-lg px-3 py-2 font-semibold text-zinc-300"
                    >
                      Admin
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Categorias (desktop) */}
        <nav className="hidden md:block border-t border-white/5" aria-label="Product categories">
          <div className="max-w-7xl mx-auto px-4 flex items-center gap-1 overflow-x-auto">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onNavigate("shop", cat.id)}
                className="flex items-center gap-1.5 text-sm font-medium text-zinc-400 hover:text-volt hover:bg-volt/5 px-3.5 py-2.5 rounded-t-lg whitespace-nowrap transition-colors"
              >
                <span aria-hidden>{cat.icon}</span>
                {cat.label}
              </button>
            ))}
            <span className="ml-auto text-xs text-zinc-500 py-2.5 whitespace-nowrap">
              🌍 Shipping to US · UK · CA · AU · EU
            </span>
          </div>
        </nav>
      </div>
    </header>
  )
}
