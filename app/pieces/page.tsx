"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Eye, Crown, Lock, Star, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import BackButton from "@/components/BackButton"

interface Product {
  id: string
  name: string
  artisticName: string
  image: string
  category: "eyewear" | "watches" | "collectibles"
  rarity: "limited" | "exclusive" | "masterpiece"
  accessLevel: "initiate" | "ascendant" | "legacy"
  remaining: number
  description: string
  specifications: string[]
  price: string
}

const products: Product[] = [
  // Eyewear Collection
  {
    id: "bv-001",
    name: "BELLVION Classic Black",
    artisticName: "Obsidian Vision",
    image: "/images/bellvion-classic-black.png",
    category: "eyewear",
    rarity: "limited",
    accessLevel: "initiate",
    remaining: 47,
    description: "Elegância atemporal encontra sofisticação moderna nesta icónica armação preta.",
    specifications: ["Armação de Titânio", "Lentes Polarizadas", "Proteção UV400", "Artesanal"],
    price: "3.500,00 MT",
  },
  {
    id: "bv-002",
    name: "BELLVION Gold Frame",
    artisticName: "Aurelius Gaze",
    image: "/images/bellvion-gold-frame.png",
    category: "eyewear",
    rarity: "exclusive",
    accessLevel: "ascendant",
    remaining: 23,
    description: "Armações luxuosas banhadas a ouro que incorporam a essência do gosto refinado.",
    specifications: ["Banho de Ouro 24K", "Lentes de Cristal", "Artesanato Italiano", "Série Limitada"],
    price: "3.500,00 MT",
  },
  {
    id: "bv-003",
    name: "BELLVION Smart Glasses",
    artisticName: "Nexus Sight",
    image: "/images/bellvion-smart-glasses.png",
    category: "eyewear",
    rarity: "masterpiece",
    accessLevel: "legacy",
    remaining: 12,
    description: "O futuro dos óculos - onde a tecnologia encontra o design atemporal.",
    specifications: ["Display AR", "Controlo por Voz", "Carregamento Sem Fios", "Integração IA"],
    price: "3.500,00 MT",
  },
  {
    id: "bv-004",
    name: "BELLVION Spectacles",
    artisticName: "Scholar's Dream",
    image: "/images/bellvion-spectacles.png",
    category: "eyewear",
    rarity: "limited",
    accessLevel: "initiate",
    remaining: 89,
    description: "Óculos clássicos reimaginados para o intelectual moderno.",
    specifications: [
      "Armação de Acetato",
      "Filtro de Luz Azul",
      "Revestimento Anti-Reflexo",
      "Apoios Nasais Ajustáveis",
    ],
    price: "3.500,00 MT",
  },
  {
    id: "bv-005",
    name: "BELLVION Eternal Moment",
    artisticName: "Chronos Whisper",
    image: "/images/bellvion-eternal-moment.jpeg",
    category: "eyewear",
    rarity: "exclusive",
    accessLevel: "ascendant",
    remaining: 31,
    description: "Capturando a essência do tempo em cada olhar.",
    specifications: ["Cristal de Safira", "Lentes Fotocromáticas", "Titânio com Memória", "Garantia Vitalícia"],
    price: "3.500,00 MT",
  },

  // Watch Collection
  {
    id: "bv-w001",
    name: "BELLVION Dragon Duo",
    artisticName: "Twin Serpents",
    image: "/images/bellvion-dragon-duo.jpeg",
    category: "watches",
    rarity: "masterpiece",
    accessLevel: "legacy",
    remaining: 8,
    description: "Dois dragões eternamente dançando ao redor do próprio tempo.",
    specifications: ["Movimento Suíço", "Gravação de Dragão", "Cristal de Safira", "Resistente à Água 100m"],
    price: "4.250,00 MT",
  },
  {
    id: "bv-w002",
    name: "BELLVION Silver Dragon",
    artisticName: "Lunar Guardian",
    image: "/images/bellvion-silver-dragon.jpeg",
    category: "watches",
    rarity: "exclusive",
    accessLevel: "ascendant",
    remaining: 15,
    description: "O dragão prateado vigia a passagem do tempo.",
    specifications: ["Caixa de Prata Sterling", "Movimento Automático", "Motivo de Dragão", "Pulseira de Couro"],
    price: "4.250,00 MT",
  },
  {
    id: "bv-w003",
    name: "BELLVION Skeleton Master",
    artisticName: "Temporal Architect",
    image: "/images/bellvion-skeleton-master.jpeg",
    category: "watches",
    rarity: "masterpiece",
    accessLevel: "legacy",
    remaining: 5,
    description: "Onde a mecânica se torna arte e o tempo se torna visível.",
    specifications: ["Movimento Skeleton", "Fundo Transparente", "Montagem Manual", "Edição Limitada"],
    price: "4.250,00 MT",
  },
  {
    id: "bv-w004",
    name: "BELLVION Rose Dragon",
    artisticName: "Crimson Timekeeper",
    image: "/images/bellvion-rose-dragon.jpeg",
    category: "watches",
    rarity: "exclusive",
    accessLevel: "ascendant",
    remaining: 19,
    description: "Elegância em ouro rosa encontra poder mítico.",
    specifications: ["Caixa de Ouro Rosa", "Padrão Escama de Dragão", "Quartzo Suíço", "Fecho Deployant"],
    price: "4.250,00 MT",
  },
  {
    id: "bv-w005",
    name: "BELLVION Forsining Elite",
    artisticName: "Golden Sovereign",
    image: "/images/bellvion-forsining-elite.jpeg",
    category: "watches",
    rarity: "limited",
    accessLevel: "initiate",
    remaining: 42,
    description: "Artesanato de elite em perfeição dourada.",
    specifications: ["Banhado a Ouro", "Movimento Mecânico", "Mostrador de Data", "Bracelete em Malha"],
    price: "4.250,00 MT",
  },
  {
    id: "bv-w006",
    name: "BELLVION Winner Diamond",
    artisticName: "Victory's Crown",
    image: "/images/bellvion-winner-diamond.jpeg",
    category: "watches",
    rarity: "masterpiece",
    accessLevel: "legacy",
    remaining: 3,
    description: "Para aqueles que conquistaram o próprio tempo.",
    specifications: ["Índices de Diamante", "Caixa de Platina", "Movimento Tourbillon", "Couro de Crocodilo"],
    price: "4.250,00 MT",
  },
  {
    id: "bv-w007",
    name: "BELLVION Racing Collection",
    artisticName: "Speed Demon",
    image: "/images/bellvion-racing-collection.jpeg",
    category: "watches",
    rarity: "limited",
    accessLevel: "initiate",
    remaining: 67,
    description: "Nascido do espírito das corridas, construído para campeões.",
    specifications: ["Função Cronógrafo", "Escala Taquimétrica", "Pulseira de Corrida", "Anti-Magnético"],
    price: "4.250,00 MT",
  },
  {
    id: "bv-w008",
    name: "BELLVION Blue Skeleton",
    artisticName: "Azure Phantom",
    image: "/images/bellvion-blue-skeleton.jpeg",
    category: "watches",
    rarity: "exclusive",
    accessLevel: "ascendant",
    remaining: 21,
    description: "Profundezas azuis revelando a alma do tempo.",
    specifications: ["Revestimento PVD Azul", "Design Coração Aberto", "Corda Automática", "Vidro de Safira"],
    price: "4.250,00 MT",
  },
]

export default function PiecesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [userLevel] = useState<"initiate" | "ascendant" | "legacy">("initiate")

  const categories = [
    { id: "all", label: "Todas as Peças" },
    { id: "eyewear", label: "Óculos" },
    { id: "watches", label: "Relógios" },
    { id: "collectibles", label: "Colecionáveis" },
  ]

  const filteredProducts =
    selectedCategory === "all" ? products : products.filter((product) => product.category === selectedCategory)

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "limited":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30"
      case "exclusive":
        return "bg-purple-500/20 text-purple-300 border-purple-500/30"
      case "masterpiece":
        return "bg-gold/20 text-gold border-gold/30"
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30"
    }
  }

  const getRarityLabel = (rarity: string) => {
    switch (rarity) {
      case "limited":
        return "Edição Limitada"
      case "exclusive":
        return "Exclusivo"
      case "masterpiece":
        return "Obra-Prima"
      default:
        return rarity
    }
  }

  const canAccess = (productLevel: string) => {
    const levels = { initiate: 1, ascendant: 2, legacy: 3 }
    return levels[userLevel as keyof typeof levels] >= levels[productLevel as keyof typeof levels]
  }

  const getWhatsAppLink = (product: Product) => {
    const phoneNumber = "258877347887"
    const message = `Olá! Tenho interesse no *${product.name}* ("${product.artisticName}")%0A%0APreço: ${product.price}%0A%0APode fornecer mais informações?`
    return `https://wa.me/${phoneNumber}?text=${message}`
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
                <Eye className="w-8 h-8 text-gold" />
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  className="absolute inset-0 border-2 border-gold/30 rounded-full"
                />
              </motion.div>
            </div>

            <h1 className="text-5xl md:text-7xl font-light tracking-wide">Museu BELLVION</h1>
            <p className="text-xl font-light text-gold">Coleção Curada de Excelência</p>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Cada peça na nossa coleção é cuidadosamente selecionada e criada para transcender o tempo, combinando
              artesanato tradicional com inovação contemporânea.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-full border transition-all duration-300 ${
                  selectedCategory === category.id
                    ? "bg-gold text-black border-gold"
                    : "bg-transparent text-gold border-gold/30 hover:border-gold hover:bg-gold/10"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <AnimatePresence>
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative"
                >
                  <div className="bg-gradient-to-br from-gray-900 to-black border border-gold/20 rounded-2xl overflow-hidden hover:border-gold/50 transition-all duration-500 hover:shadow-2xl hover:shadow-gold/20">
                    {/* Product Image */}
                    <div className="relative aspect-square overflow-hidden">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />

                      {/* Shimmer Effect */}
                      <motion.div
                        animate={{ x: [-100, 400] }}
                        transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, repeatDelay: 2 }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
                      />

                      {/* Rarity Badge */}
                      <div className="absolute top-4 left-4">
                        <Badge className={`${getRarityColor(product.rarity)} border`}>
                          {getRarityLabel(product.rarity)}
                        </Badge>
                      </div>

                      {/* Access Level */}
                      <div className="absolute top-4 right-4">
                        {!canAccess(product.accessLevel) && (
                          <div className="bg-black/80 backdrop-blur-sm rounded-full p-2">
                            <Lock className="w-4 h-4 text-gold" />
                          </div>
                        )}
                      </div>

                      {/* Remaining Count */}
                      <div className="absolute bottom-4 left-4">
                        <div className="bg-black/80 backdrop-blur-sm rounded-full px-3 py-1">
                          <span className="text-gold text-xs font-medium">{product.remaining} restantes</span>
                        </div>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-6">
                      <div className="mb-3">
                        <h3 className="text-lg font-medium text-white mb-1">{product.name}</h3>
                        <p className="text-gold text-sm italic">"{product.artisticName}"</p>
                      </div>

                      <p className="text-gray-400 text-sm mb-3 line-clamp-2">{product.description}</p>

                      {/* Price */}
                      <div className="mb-4">
                        <p className="text-2xl font-bold text-gold">{product.price}</p>
                      </div>

                      {/* Action Buttons */}
                      {canAccess(product.accessLevel) ? (
                        <div className="space-y-3">
                          <Button
                            onClick={() => window.open(getWhatsAppLink(product), "_blank")}
                            className="w-full bg-green-600 text-white hover:bg-green-700 border-0"
                          >
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Comprar via WhatsApp
                          </Button>
                          <Button
                            onClick={() => setSelectedProduct(product)}
                            className="w-full bg-transparent border border-gold/30 text-gold hover:bg-gold hover:text-black"
                          >
                            Ver Detalhes
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <Lock className="w-8 h-8 text-gold/50 mx-auto mb-2" />
                          <p className="text-gold/70 text-sm mb-3">Acesso Necessário</p>
                          <a
                            href="/ascend"
                            className="inline-block px-4 py-2 border border-gold/30 text-gold hover:bg-gold hover:text-black transition-all duration-300 text-sm rounded-lg"
                          >
                            Ver Caminho
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
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
              className="bg-black border border-gold/20 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="relative aspect-square">
                    <Image
                      src={selectedProduct.image || "/placeholder.svg"}
                      alt={selectedProduct.name}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h2 className="text-3xl font-light text-white mb-2">{selectedProduct.name}</h2>
                      <p className="text-gold text-lg italic">"{selectedProduct.artisticName}"</p>
                      <Badge className={`${getRarityColor(selectedProduct.rarity)} border mt-3`}>
                        {getRarityLabel(selectedProduct.rarity)}
                      </Badge>
                    </div>

                    <p className="text-gray-300 leading-relaxed">{selectedProduct.description}</p>

                    {/* Price in Modal */}
                    <div className="py-4 border-y border-gold/20">
                      <p className="text-3xl font-bold text-gold">{selectedProduct.price}</p>
                    </div>

                    <div>
                      <h3 className="text-white font-medium mb-3">Especificações</h3>
                      <ul className="space-y-2">
                        {selectedProduct.specifications.map((spec, index) => (
                          <li key={index} className="flex items-center text-gray-300">
                            <Star className="w-4 h-4 text-gold mr-2 flex-shrink-0" />
                            {spec}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gold/20">
                      <div>
                        <p className="text-gold font-medium">{selectedProduct.remaining} restantes</p>
                        <p className="text-gray-400 text-sm">Curado por BELLVION</p>
                      </div>
                    </div>

                    <Button
                      onClick={() => window.open(getWhatsAppLink(selectedProduct), "_blank")}
                      className="w-full bg-green-600 text-white hover:bg-green-700 border-0 py-6 text-lg"
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

      {/* Access Level Info */}
      <section className="py-16 bg-gradient-to-t from-gray-900 to-black">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="space-y-8"
          >
            <Crown className="w-16 h-16 text-gold mx-auto" />
            <h3 className="text-3xl font-light tracking-wide">Acesso a Níveis Superiores</h3>
            <p className="text-lg text-gray-300 leading-relaxed">
              Algumas peças requerem níveis de acesso mais elevados. Junte-se ao nosso programa de ascensão para
              desbloquear coleções exclusivas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/ascend"
                className="inline-block px-8 py-3 border border-gold text-gold hover:bg-gold hover:text-black transition-all duration-500 tracking-widest text-sm"
              >
                Ver Caminho
              </a>
              <a
                href="/circle"
                className="inline-block px-8 py-3 bg-gold text-black hover:bg-gold/80 transition-all duration-500 tracking-widest text-sm"
              >
                Juntar ao Círculo
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
