"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Search, SlidersHorizontal, Grid3x3, List, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

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
  category?: { name: string } | null
}

interface ProductGalleryProps {
  products: Product[]
  categories: Array<{ id: string; name: string }>
}

export function ProductGallery({ products, categories }: ProductGalleryProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000])
  const [sortBy, setSortBy] = useState<"newest" | "price-low" | "price-high" | "name">("newest")
  const [showFilters, setShowFilters] = useState(false)

  // Advanced filtering
  const filteredProducts = useMemo(() => {
    let result = [...products]

    // Search filter
    if (searchQuery) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.artistic_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Category filter
    if (selectedCategories.length > 0) {
      result = result.filter((p) => p.category_id && selectedCategories.includes(p.category_id))
    }

    // Price range filter
    result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1])

    // Sorting
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        result.sort((a, b) => b.price - a.price)
        break
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "newest":
        result.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
        break
    }

    return result
  }, [products, searchQuery, selectedCategories, priceRange, sortBy])

  const formatPrice = (price: number) => {
    return `${Number(price).toLocaleString("pt-MZ", { minimumFractionDigits: 2 })} MT`
  }

  return (
    <div className="space-y-8">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gold pointer-events-none" />
        <Input
          placeholder="Buscar óculos, relógios, colecionáveis..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 bg-gray-900/50 border-gold/20 focus:border-gold text-white placeholder-gray-500"
        />
      </div>

      {/* Filter & View Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2">
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant={showFilters ? "default" : "outline"}
            className="gap-2"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filtros
          </Button>
          <div className="border border-gold/20 rounded-lg p-1 flex gap-1">
            <Button
              size="sm"
              onClick={() => setViewMode("grid")}
              variant={viewMode === "grid" ? "default" : "ghost"}
              className="gap-1"
            >
              <Grid3x3 className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              onClick={() => setViewMode("list")}
              variant={viewMode === "list" ? "default" : "ghost"}
              className="gap-1"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="text-sm text-gray-400">
          {filteredProducts.length} de {products.length} produtos
        </div>
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border border-gold/20 rounded-lg p-6 bg-gray-900/50 space-y-6"
          >
            {/* Categories */}
            <div className="space-y-3">
              <h3 className="text-gold font-light text-sm tracking-wider">CATEGORIAS</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() =>
                      setSelectedCategories((prev) =>
                        prev.includes(cat.id) ? prev.filter((id) => id !== cat.id) : [...prev, cat.id],
                      )
                    }
                    className={`px-3 py-2 rounded text-sm font-light transition-all ${
                      selectedCategories.includes(cat.id)
                        ? "bg-gold text-black border border-gold"
                        : "bg-gray-800 text-white border border-gray-600 hover:border-gold"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="space-y-3">
              <h3 className="text-gold font-light text-sm tracking-wider">INTERVALO DE PREÇO</h3>
              <div className="flex gap-4">
                <div className="flex-1">
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white text-sm"
                    placeholder="Min"
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white text-sm"
                    placeholder="Max"
                  />
                </div>
              </div>
            </div>

            {/* Sort */}
            <div className="space-y-3">
              <h3 className="text-gold font-light text-sm tracking-wider">ORDENAR POR</h3>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white text-sm"
              >
                <option value="newest">Mais Recentes</option>
                <option value="price-low">Preço: Menor para Maior</option>
                <option value="price-high">Preço: Maior para Menor</option>
                <option value="name">Nome (A-Z)</option>
              </select>
            </div>

            {/* Clear Filters */}
            {(searchQuery || selectedCategories.length > 0 || priceRange[0] > 0 || priceRange[1] < 10000) && (
              <Button
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategories([])
                  setPriceRange([0, 10000])
                  setSortBy("newest")
                }}
                variant="outline"
                className="w-full"
              >
                Limpar Filtros
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg">Nenhum produto encontrado com os filtros selecionados.</p>
        </div>
      ) : viewMode === "grid" ? (
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {filteredProducts.map((product, index) => (
              <motion.div key={product.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="group bg-gradient-to-br from-gray-900 to-black border border-gold/20 rounded-2xl overflow-hidden hover:border-gold/50 transition-all duration-500 hover:shadow-2xl hover:shadow-gold/20 h-full flex flex-col">
                  <div className="relative aspect-square overflow-hidden bg-gray-800">
                    <Image
                      src={product.image_url || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <motion.div
                      animate={{ x: [-100, 400] }}
                      transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
                    />
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-white mb-1 line-clamp-2">{product.name}</h3>
                      {product.artistic_name && (
                        <p className="text-gold text-xs italic mb-2">"{product.artistic_name}"</p>
                      )}
                    </div>
                    <p className="text-xl font-bold text-gold">{formatPrice(product.price)}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="border border-gold/20 rounded-lg p-4 flex gap-4 hover:border-gold/50 transition-all group cursor-pointer bg-gray-900/30 hover:bg-gray-800/50"
            >
              <div className="relative w-24 h-24 rounded overflow-hidden flex-shrink-0">
                <Image
                  src={product.image_url || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-medium">{product.name}</h3>
                {product.artistic_name && <p className="text-gold text-sm italic">"{product.artistic_name}"</p>}
                <p className="text-gray-400 text-sm mt-1 line-clamp-2">{product.description}</p>
                <p className="text-gold font-bold mt-2">{formatPrice(product.price)}</p>
              </div>
              <div className="flex flex-col items-end justify-between">
                <span className="text-gray-400 text-sm">{product.stock} em stock</span>
                <Button size="sm" className="bg-gold text-black hover:bg-gold/90">
                  Ver
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
