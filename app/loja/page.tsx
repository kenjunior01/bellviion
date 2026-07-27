"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Star, MessageCircle, ShoppingBag, X, Loader2, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import BackButton from "@/components/BackButton"
import { ProductGallery } from "@/components/product-gallery"
import { createClient } from "@/lib/supabase/client"

interface Category {
  id: string
  name: string
  description: string | null
  icon: string | null
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

export default function LojaPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const supabase = createClient()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)

    // Fetch categories and products in parallel
    const [categoriesResult, productsResult] = await Promise.all([
      supabase.from("categories").select("*").order("name"),
      supabase
        .from("products")
        .select("*, category:categories(*)")
        .eq("is_active", true)
        .order("created_at", { ascending: false }),
    ])

    if (categoriesResult.data) setCategories(categoriesResult.data)
    if (productsResult.data) setProducts(productsResult.data)

    setLoading(false)
  }

  const filteredProducts =
    selectedCategory === "all" ? products : products.filter((product) => product.category_id === selectedCategory)

  const formatPrice = (price: number) => {
    return `${Number(price).toLocaleString("pt-MZ", { minimumFractionDigits: 2 })} MT`
  }

  const getWhatsAppLink = (product: Product) => {
    const phoneNumber = "258877347887"
    const message = encodeURIComponent(
      `Olá! Tenho interesse no *${product.name}*${product.artistic_name ? ` ("${product.artistic_name}")` : ""}\n\nPreço: ${formatPrice(product.price)}\n\nPode fornecer mais informações?`,
    )
    return `https://wa.me/${phoneNumber}?text=${message}`
  }

  const handleWhatsAppClick = (product: Product) => {
    window.open(getWhatsAppLink(product), "_blank")
  }

  const FloatingParticles = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-gold/30 rounded-full"
          initial={{
            x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1920),
            y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 1080),
          }}
          animate={{
            x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1920),
            y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 1080),
          }}
          transition={{
            duration: 25 + Math.random() * 15,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            ease: "linear",
          }}
        />
      ))}
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-gold animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white relative">
      <FloatingParticles />
      <BackButton />

      {/* Hero Section */}
      <section className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="space-y-8"
          >
            <div className="flex justify-center mb-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                className="w-24 h-24 border-2 border-gold rounded-full flex items-center justify-center relative"
              >
                <ShoppingBag className="w-8 h-8 text-gold" />
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  className="absolute inset-0 border-2 border-gold/30 rounded-full"
                />
              </motion.div>
            </div>

            <h1 className="text-5xl md:text-7xl font-light tracking-wide">Loja BELLVION</h1>
            <p className="text-xl font-light text-gold">Coleção Exclusiva de Luxo</p>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Descubra a nossa coleção curada de óculos e relógios de luxo. Cada peça é uma obra de arte, criada para
              aqueles que apreciam o extraordinário.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Product Gallery with Advanced Filters */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <ProductGallery products={filteredProducts} categories={categories} />
        </div>
      </section>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 border border-gold/20 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="relative aspect-square bg-gray-800 rounded-xl overflow-hidden">
                    <Image
                      src={selectedProduct.image_url || "/placeholder.svg?height=500&width=500&query=luxury product"}
                      alt={selectedProduct.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h2 className="text-3xl font-light text-white mb-2">{selectedProduct.name}</h2>
                      {selectedProduct.artistic_name && (
                        <p className="text-gold text-lg italic">"{selectedProduct.artistic_name}"</p>
                      )}
                      {selectedProduct.category && (
                        <Badge className="bg-gold/20 text-gold border border-gold/30 mt-3">
                          {selectedProduct.category.name}
                        </Badge>
                      )}
                    </div>

                    {selectedProduct.description && (
                      <p className="text-gray-300 leading-relaxed">{selectedProduct.description}</p>
                    )}

                    {/* Price */}
                    <div className="py-4 border-y border-gold/20">
                      <p className="text-3xl font-bold text-gold">{formatPrice(selectedProduct.price)}</p>
                    </div>

                    {/* Specifications */}
                    {selectedProduct.specs && Object.keys(selectedProduct.specs).length > 0 && (
                      <div>
                        <h3 className="text-white font-medium mb-3">Especificações</h3>
                        <ul className="space-y-2">
                          {Object.entries(selectedProduct.specs).map(([key, value]) => (
                            <li key={key} className="flex items-center text-gray-300">
                              <Star className="w-4 h-4 text-gold mr-2 flex-shrink-0" />
                              <span className="text-gray-500 capitalize">{key}:</span>
                              <span className="ml-2">{value}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-gold/20">
                      <div>
                        <p className="text-gold font-medium">{selectedProduct.stock} unidades</p>
                        <p className="text-gray-400 text-sm">Disponíveis</p>
                      </div>
                    </div>

                    <Button
                      onClick={() => handleWhatsAppClick(selectedProduct)}
                      className="w-full bg-green-600 text-white hover:bg-green-700 py-6"
                    >
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Comprar via WhatsApp
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-black text-white py-8 border-t border-gold/20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gold font-light tracking-widest text-sm mb-4">Onde o legado encontra a eternidade</p>
          <div className="flex justify-center items-center space-x-8 text-xs text-gray-400">
            <span>© 2025 BELLVION</span>
            <span>•</span>
            <span>Autêntico, Raro, Memorável</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
