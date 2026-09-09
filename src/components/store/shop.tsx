"use client"

import { useState } from "react"
import { Search, SlidersHorizontal, PackageSearch } from "lucide-react"
import { motion } from "framer-motion"
import type { Product } from "@/lib/store-data"
import { CATEGORIES } from "@/lib/store-data"
import { ProductCard } from "./shared"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ShopProps {
  products: Product[]
  initialCategory?: string
  searchQuery?: string
  onSelectProduct: (p: Product) => void
}

export function ShopView({ products, initialCategory = "all", searchQuery = "", onSelectProduct }: ShopProps) {
  const [category, setCategory] = useState(initialCategory)
  const [search, setSearch] = useState(searchQuery)
  const [sort, setSort] = useState("trending")

  const filtered = products
    .filter((p) => (category === "all" ? true : p.category === category))
    .filter((p) => {
      if (!search) return true
      const q = search.toLowerCase()
      return (
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.keywords || "").toLowerCase().includes(q)
      )
    })

  const sorted = [...filtered].sort((a, b) => {
    switch (sort) {
      case "price-asc": return a.price - b.price
      case "price-desc": return b.price - a.price
      case "rating": return b.rating - a.rating
      case "newest": return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      default: return b.soldCount - a.soldCount
    }
  })

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Título */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mb-8"
      >
        <p className="text-[11px] font-black text-volt uppercase tracking-[0.3em] mb-2">Shop</p>
        <h1 className="text-4xl sm:text-5xl font-black font-display uppercase tracking-tight text-white">
          {category === "all" ? <>All <span className="text-stroke">Products</span></> : CATEGORIES.find((c) => c.id === category)?.label || "Shop"}
        </h1>
        <p className="text-sm text-zinc-500 mt-2">
          {sorted.length} products · Free worldwide shipping on orders over $35
        </p>
      </motion.div>

      {/* Filtros */}
      <div className="flex flex-col lg:flex-row gap-3 mb-7 items-stretch lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-11 pr-4 py-3 text-sm bg-white/5 rounded-2xl border border-white/10 text-white placeholder:text-zinc-500 outline-none focus:border-volt/50 focus:ring-2 focus:ring-volt/20 transition-all"
            aria-label="Search products"
          />
        </div>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-full lg:w-[200px] bg-white/5 border border-white/10 rounded-2xl py-3 text-zinc-300" aria-label="Sort products">
            <SlidersHorizontal className="w-4 h-4 text-volt mr-1" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="bg-popover border-white/10">
            <SelectItem value="trending">🔥 Most Popular</SelectItem>
            <SelectItem value="newest">✨ Newest</SelectItem>
            <SelectItem value="price-asc">💵 Price: Low to High</SelectItem>
            <SelectItem value="price-desc">💎 Price: High to Low</SelectItem>
            <SelectItem value="rating">⭐ Top Rated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Chips de categoria */}
      <div className="flex gap-2 overflow-x-auto pb-5 mb-7 -mx-4 px-4" role="tablist" aria-label="Categories">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            role="tab"
            aria-selected={category === cat.id}
            onClick={() => setCategory(cat.id)}
            className={`flex items-center gap-1.5 whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-all ${
              category === cat.id
                ? "bg-volt text-zinc-950 glow-volt"
                : "glass text-zinc-400 hover:text-white hover:border-white/20"
            }`}
          >
            <span aria-hidden>{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {sorted.length === 0 ? (
        <div className="text-center py-24">
          <PackageSearch className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
          <p className="text-zinc-300 font-bold text-lg font-display">No products found</p>
          <p className="text-sm text-zinc-500 mt-1">Try a different search or category</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {sorted.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: Math.min(i, 8) * 0.05, ease: [0.22, 1, 0.36, 1] }}
            >
              <ProductCard product={p} onSelect={onSelectProduct} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
