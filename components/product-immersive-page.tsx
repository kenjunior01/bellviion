"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Heart, Share2, ShoppingBag, Zap, Award, Leaf } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface SavoirFaire {
  heritage: string
  materials: string[]
  craftsman: string
  process: string
  sustainability: string
}

interface Product {
  id: string
  name: string
  artistic_name: string | null
  description: string | null
  price: number
  image_url: string | null
  category?: { name: string } | null
  specs: Record<string, string>
  stock: number
  savoirFaire: SavoirFaire
}

interface ProductImmersivePageProps {
  product: Product
  onAddToCart?: () => void
  onShare?: () => void
}

export function ProductImmersivePage({ product, onAddToCart, onShare }: ProductImmersivePageProps) {
  const [imageIndex, setImageIndex] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  const images = [product.image_url || "/placeholder.svg"]
  const hasSpecifications = Object.keys(product.specs || {}).length > 0

  const formatPrice = (price: number) => {
    return `${Number(price).toLocaleString("pt-MZ", { minimumFractionDigits: 2 })} MT`
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section with Image Gallery */}
      <section className="pt-8 pb-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <motion.div
              key={imageIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative aspect-square bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gold/20 overflow-hidden group"
            >
              <Image
                src={images[imageIndex] || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />

              {/* Corner Badge */}
              <div className="absolute top-4 right-4 z-10">
                <Badge className="bg-gold/20 text-gold border border-gold/30">Exclusivo</Badge>
              </div>

              {/* Image Navigation */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setImageIndex((prev) => (prev - 1 + images.length) % images.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/50 rounded-full hover:bg-gold/20 transition-all"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => setImageIndex((prev) => (prev + 1) % images.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/50 rounded-full hover:bg-gold/20 transition-all"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Shimmer Effect */}
              <motion.div
                animate={{ x: [-100, 400] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
              />
            </motion.div>

            {/* Thumbnail Navigation */}
            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setImageIndex(idx)}
                    className={`w-16 h-16 rounded border-2 transition-all overflow-hidden ${
                      idx === imageIndex ? "border-gold" : "border-gold/20 hover:border-gold/50"
                    }`}
                  >
                    <Image src={img || "/placeholder.svg"} alt={`${product.name} ${idx}`} width={64} height={64} className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            {/* Header */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-gold" />
                <span className="text-gold text-xs tracking-widest font-light">
                  {product.category?.name || "COLEÇÃO"}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-light tracking-wide">{product.name}</h1>
              {product.artistic_name && (
                <p className="text-gold text-xl italic">"{product.artistic_name}"</p>
              )}
            </div>

            {/* Price */}
            <div className="border-y border-gold/20 py-6 space-y-2">
              <p className="text-gold text-sm tracking-widest font-light">INVESTIMENTO</p>
              <p className="text-5xl font-light text-gold">{formatPrice(product.price)}</p>
              <p className="text-gray-400 text-sm">Preço fixo de luxo - Sem negociação</p>
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-gray-300 text-lg leading-relaxed">{product.description}</p>
            )}

            {/* Actions */}
            <div className="space-y-3">
              <Button
                onClick={onAddToCart}
                className="w-full bg-gold text-black hover:bg-gold/90 py-6 font-light tracking-wider text-lg"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                ADQUIRIR PEÇA
              </Button>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => setIsLiked(!isLiked)}
                  variant="outline"
                  className="bg-transparent border-gold/30 text-gold hover:bg-gold/10"
                >
                  <Heart className={`w-5 h-5 mr-2 ${isLiked ? "fill-current" : ""}`} />
                  {isLiked ? "Guardado" : "Guardar"}
                </Button>
                <Button
                  onClick={onShare}
                  variant="outline"
                  className="bg-transparent border-gold/30 text-gold hover:bg-gold/10"
                >
                  <Share2 className="w-5 h-5 mr-2" />
                  Partilhar
                </Button>
              </div>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2 p-4 bg-gold/10 border border-gold/20 rounded-lg">
              <Zap className="w-5 h-5 text-gold flex-shrink-0" />
              <span className="text-sm">
                <span className="font-light">{product.stock} peças</span> disponíveis em stock
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Tabbed Content - Specifications, Savoir-Faire, etc */}
      <section className="py-16 px-4 md:px-8 bg-gradient-to-b from-gray-900/50 to-black">
        <div className="max-w-7xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-900/50 border border-gold/20 rounded-lg p-1 mb-8">
              <TabsTrigger value="overview" className="data-[state=active]:bg-gold/20 data-[state=active]:text-gold">
                Visão Geral
              </TabsTrigger>
              <TabsTrigger value="savoir" className="data-[state=active]:bg-gold/20 data-[state=active]:text-gold">
                Savoir-Faire
              </TabsTrigger>
              <TabsTrigger value="specs" className="data-[state=active]:bg-gold/20 data-[state=active]:text-gold">
                Especificações
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="bg-gray-900/30 border border-gold/20 rounded-lg p-8 space-y-6">
                <h3 className="text-2xl font-light tracking-wide text-gold">Sobre Esta Peça</h3>
                <p className="text-gray-300 text-lg leading-relaxed">{product.description}</p>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 gap-6 pt-6">
                  <div className="space-y-3">
                    <h4 className="text-gold font-light tracking-wider text-sm">DIFERENCIAIS</h4>
                    <ul className="space-y-2">
                      {[
                        "Autenticidade garantida",
                        "Certificado de origem",
                        "Garantia de qualidade",
                        "Suporte permanente",
                      ].map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-gray-300">
                          <Award className="w-4 h-4 text-gold flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-gold font-light tracking-wider text-sm">GARANTIAS</h4>
                    <ul className="space-y-2">
                      {[
                        "100% Autêntico",
                        "Retorno em 30 dias",
                        "Política de devolução",
                        "Inspeção completa",
                      ].map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-gray-300">
                          <Award className="w-4 h-4 text-gold flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Savoir-Faire Tab */}
            <TabsContent value="savoir" className="space-y-6">
              <div className="bg-gray-900/30 border border-gold/20 rounded-lg p-8 space-y-8">
                <h3 className="text-2xl font-light tracking-wide text-gold">O Artesanato Por Trás do Luxo</h3>

                {/* Heritage */}
                <div className="space-y-3 border-b border-gold/20 pb-8">
                  <h4 className="text-lg font-light text-gold tracking-wider">Herança</h4>
                  <p className="text-gray-300 leading-relaxed">
                    {product.savoirFaire?.heritage ||
                      "Esta peça representa séculos de tradição artesanal, combinando técnicas ancestrais com inovação contemporânea."}
                  </p>
                </div>

                {/* Materials */}
                <div className="space-y-3 border-b border-gold/20 pb-8">
                  <h4 className="text-lg font-light text-gold tracking-wider">Materiais Selecionados</h4>
                  <div className="grid md:grid-cols-2 gap-3">
                    {(product.savoirFaire?.materials || ["Acetato italiano", "Lentes de precisão"]).map((material, i) => (
                      <div key={i} className="flex items-center gap-2 p-3 bg-gold/5 border border-gold/20 rounded">
                        <Leaf className="w-4 h-4 text-gold flex-shrink-0" />
                        <span className="text-gray-300">{material}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Craftsmanship */}
                <div className="space-y-3 border-b border-gold/20 pb-8">
                  <h4 className="text-lg font-light text-gold tracking-wider">Artesão Responsável</h4>
                  <p className="text-gray-300">{product.savoirFaire?.craftsman || "Mestre Artesão da Casa BELLVION"}</p>
                </div>

                {/* Process */}
                <div className="space-y-3 border-b border-gold/20 pb-8">
                  <h4 className="text-lg font-light text-gold tracking-wider">Processo de Criação</h4>
                  <p className="text-gray-300 leading-relaxed">
                    {product.savoirFaire?.process || "Cada peça é criada manualmente, passando por 47 etapas de controlo de qualidade."}
                  </p>
                </div>

                {/* Sustainability */}
                <div className="space-y-3">
                  <h4 className="text-lg font-light text-gold tracking-wider">Compromisso de Sustentabilidade</h4>
                  <p className="text-gray-300 leading-relaxed">
                    {product.savoirFaire?.sustainability ||
                      "Utiliza materiais eco-responsáveis e processos que minimizam o impacto ambiental."}
                  </p>
                </div>
              </div>
            </TabsContent>

            {/* Specifications Tab */}
            <TabsContent value="specs" className="space-y-6">
              {hasSpecifications ? (
                <div className="bg-gray-900/30 border border-gold/20 rounded-lg p-8">
                  <h3 className="text-2xl font-light tracking-wide text-gold mb-6">Especificações Técnicas</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {Object.entries(product.specs).map(([key, value]) => (
                      <div key={key} className="border-b border-gold/20 pb-4">
                        <p className="text-gold text-sm tracking-widest font-light mb-2">{key.toUpperCase()}</p>
                        <p className="text-gray-300">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <p>Especificações detalhadas disponíveis mediante solicitação.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 md:px-8 border-t border-gold/20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-light tracking-wide">Pronto para Possuir Esta Obra-Prima?</h2>
          <p className="text-gray-300 text-lg">
            Cada peça é única. Uma vez adquirida, torna-se parte do seu legado pessoal.
          </p>
          <Button
            onClick={onAddToCart}
            className="bg-gold text-black hover:bg-gold/90 px-12 py-6 font-light tracking-wider text-lg"
          >
            ADQUIRIR AGORA
          </Button>
        </div>
      </section>
    </div>
  )
}
