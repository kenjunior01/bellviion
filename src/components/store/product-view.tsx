"use client"

import { useState, useEffect, useMemo } from "react"
import {
  ShieldCheck, Truck, RotateCcw, Eye, ShoppingCart, Zap, Share2, Heart, Minus, Plus, Flame, ArrowLeft,
} from "lucide-react"
import { motion } from "framer-motion"
import type { Product, Review } from "@/lib/store-data"
import { formatPrice, discountPercent, COUNTRY_FLAGS } from "@/lib/store-data"
import { useCart, useCurrency, useTracking } from "@/lib/cart-store"
import { Stars, ProductBadge } from "./shared"
import { toast } from "sonner"
import { Progress } from "@/components/ui/progress"

interface ProductViewProps {
  product: Product
  reviews: Review[]
  related: Product[]
  onBack: () => void
  onSelectProduct: (p: Product) => void
  onGoToCart: () => void
}

export function ProductView({ product, reviews, related, onBack, onSelectProduct, onGoToCart }: ProductViewProps) {
  const currency = useCurrency((s) => s.currency)
  const addItem = useCart((s) => s.addItem)
  const referralCode = useTracking((s) => s.referralCode)

  const [quantity, setQuantity] = useState(1)
  const [viewers] = useState(() => 18 + Math.floor(Math.random() * 65))
  const [buying, setBuying] = useState(false)
  const discount = discountPercent(product.price, product.compareAtPrice)

  // Registra visualização do produto
  useEffect(() => {
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "product_view", productId: product.id, referralCode }),
    }).catch(() => {})
  }, [product.id])

  // Data estimada de entrega
  const deliveryRange = useMemo(() => {
    const fmt = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    const from = new Date(Date.now() + product.shippingDaysMin * 86400000)
    const to = new Date(Date.now() + product.shippingDaysMax * 86400000)
    return `${fmt(from)} – ${fmt(to)}`
  }, [product.shippingDaysMin, product.shippingDaysMax])

  const trackAndAdd = () => {
    addItem({
      productId: product.id,
      name: product.name,
      image: product.image,
      price: product.price,
      quantity,
    })
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "add_to_cart", productId: product.id, referralCode }),
    }).catch(() => {})
    toast.success(`✅ ${product.name} added to cart!`)
  }

  const buyNow = async () => {
    setBuying(true)
    try {
      trackAndAdd()
      await new Promise((r) => setTimeout(r, 350))
      onGoToCart()
    } finally {
      setBuying(false)
    }
  }

  const shareUrl = typeof window !== "undefined" ? window.location.origin + "/" : ""
  const shareText = `Check out ${product.name} on Bellviion — only ${formatPrice(product.price, currency)}! 🛍️`

  const shareLinks = [
    { label: "WhatsApp", href: `https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`, icon: "💬" },
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, icon: "📘" },
    { label: "X", href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, icon: "𝕏" },
    { label: "Pinterest", href: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&media=${encodeURIComponent(product.image)}&description=${encodeURIComponent(shareText)}`, icon: "📌" },
  ]

  const stockPercent = Math.min(100, Math.max(8, product.stock))

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 relative">
      {/* Aurora */}
      <div className="absolute top-0 right-0 w-[420px] h-[420px] aurora-volt opacity-60 pointer-events-none" aria-hidden />

      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-400 hover:text-volt transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to shop
      </button>

      <div className="relative grid lg:grid-cols-2 gap-8 lg:gap-12">
        {/* ===== Imagem ===== */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="relative rounded-[2rem] overflow-hidden glass shine">
            <img
              src={product.image}
              alt={product.name}
              className="w-full aspect-square object-cover"
              itemProp="image"
            />
            <div className="absolute top-4 left-4"><ProductBadge badge={product.badge} /></div>
            {discount > 0 && (
              <span className="absolute top-4 right-4 bg-ember text-white text-sm font-black px-3 py-1.5 rounded-full shadow-glow-ember">
                −{discount}% OFF
              </span>
            )}
            <button
              className="absolute bottom-4 right-4 w-10 h-10 glass-strong rounded-full flex items-center justify-center hover:scale-110 transition-transform"
              aria-label="Add to wishlist"
              onClick={() => toast("❤️ Saved to your wishlist!")}
            >
              <Heart className="w-5 h-5 text-ember" />
            </button>
          </div>

          {/* Prova social em tempo real */}
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-zinc-400 glass rounded-full px-4 py-2 w-fit mx-auto">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-volt opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-volt" />
            </span>
            <Eye className="w-3.5 h-3.5" />
            <strong className="text-white">{viewers} people</strong> are viewing this right now
          </div>
        </motion.div>

        {/* ===== Info de compra ===== */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col"
        >
          <h1 className="text-3xl sm:text-4xl font-black font-display tracking-tight text-white leading-[1.05]" itemProp="name">
            {product.name}
          </h1>
          {product.tagline && <p className="text-zinc-400 mt-3">{product.tagline}</p>}

          <div className="flex items-center gap-2 mt-4 flex-wrap">
            <Stars rating={product.rating} size={15} />
            <span className="text-sm font-bold text-white">{product.rating}</span>
            <a href="#reviews" className="text-sm text-volt hover:underline font-semibold">
              {product.reviewCount.toLocaleString()} reviews
            </a>
            <span className="text-zinc-700">|</span>
            <span className="text-sm text-zinc-400 font-medium">
              🔥 {product.soldCount.toLocaleString()}+ sold
            </span>
          </div>

          {/* Preço */}
          <div className="flex items-baseline gap-3 mt-6" itemProp="offers" itemScope itemType="https://schema.org/Offer">
            <meta itemProp="priceCurrency" content={currency} />
            <span className="text-5xl font-black font-display text-white">{formatPrice(product.price, currency)}</span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <>
                <span className="text-xl text-zinc-500 line-through">{formatPrice(product.compareAtPrice, currency)}</span>
                <span className="bg-volt/15 text-volt text-xs font-black px-2.5 py-1 rounded-full border border-volt/30">
                  Save {formatPrice(product.compareAtPrice - product.price, currency)}
                </span>
              </>
            )}
          </div>
          <p className="text-xs text-volt font-bold mt-2 uppercase tracking-wider">
            📦 FREE worldwide shipping on orders over $35
          </p>

          {/* Urgência de estoque */}
          <div className="mt-6 bg-ember/10 border border-ember/25 rounded-2xl p-4">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold text-ember flex items-center gap-1">
                <Flame className="w-3.5 h-3.5" /> Selling fast — only {product.stock} left in stock
              </span>
              <span className="text-ember/90 font-bold">{100 - stockPercent}% claimed</span>
            </div>
            <Progress value={100 - stockPercent} className="h-2 bg-ember/20 [&>div]:bg-gradient-to-r [&>div]:from-ember [&>div]:to-orange-400" />
          </div>

          {/* Quantidade + CTA */}
          <div className="flex gap-3 mt-7">
            <div className="flex items-center glass rounded-2xl overflow-hidden shrink-0">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3.5 py-3.5 hover:bg-white/5 text-zinc-300"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-10 text-center font-black text-white">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(10, quantity + 1))}
                className="px-3.5 py-3.5 hover:bg-white/5 text-zinc-300"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={trackAndAdd}
              className="flex-1 border-2 border-volt/60 text-volt font-black font-display uppercase tracking-wide rounded-2xl hover:bg-volt/10 transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" /> Add to Cart
            </button>
          </div>

          <button
            onClick={buyNow}
            disabled={buying}
            className="mt-3 w-full bg-volt text-zinc-950 font-black font-display uppercase tracking-wide text-lg py-4 rounded-2xl glow-volt hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            <Zap className="w-5 h-5" />
            {buying ? "Processing..." : `Buy It Now — ${formatPrice(product.price * quantity, currency)}`}
          </button>

          {/* PayPal badge */}
          <div className="mt-5 flex items-center justify-center gap-3 glass rounded-2xl py-3.5 px-4">
            <span className="text-xs text-zinc-400">Guaranteed safe &amp; secure checkout via</span>
            <span className="font-black italic text-lg text-[#8ab4ff]">Pay<span className="text-[#c7e2ff]">Pal</span></span>
            <span className="text-xs text-zinc-500">· Visa · Mastercard</span>
          </div>

          {/* Garantias */}
          <div className="grid grid-cols-3 gap-2.5 mt-5">
            {[
              { icon: <Truck className="w-4 h-4" />, label: "Estimated delivery", value: deliveryRange },
              { icon: <RotateCcw className="w-4 h-4" />, label: "30-Day Returns", value: "Money-back guarantee" },
              { icon: <ShieldCheck className="w-4 h-4" />, label: "PayPal Protection", value: "Refund if not received" },
            ].map((g) => (
              <div key={g.label} className="glass rounded-2xl p-3.5 text-center">
                <span className="text-volt flex justify-center">{g.icon}</span>
                <p className="text-[10px] font-bold text-zinc-200 mt-2">{g.label}</p>
                <p className="text-[10px] text-zinc-500 mt-0.5">{g.value}</p>
              </div>
            ))}
          </div>

          {/* Share viral */}
          <div className="flex items-center gap-2 mt-6">
            <Share2 className="w-4 h-4 text-zinc-500" />
            <span className="text-xs font-bold text-zinc-400">Share &amp; get 10% off next order:</span>
            <div className="flex gap-1.5 ml-auto">
              {shareLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Share on ${s.label}`}
                  className="w-8 h-8 glass hover:bg-volt hover:text-zinc-950 rounded-full flex items-center justify-center text-sm transition-all text-zinc-300"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Descrição */}
          <div className="mt-8 border-t border-white/10 pt-7">
            <h2 className="font-black font-display uppercase tracking-wide text-white mb-3">Why You&apos;ll Love It</h2>
            <p className="text-sm text-zinc-400 leading-relaxed">{product.description}</p>
          </div>
        </motion.div>
      </div>

      {/* ===== Reviews ===== */}
      <section id="reviews" className="mt-16 border-t border-white/10 pt-12" aria-label="Customer reviews">
        <div className="flex items-center gap-4 mb-7 flex-wrap">
          <h2 className="text-2xl font-black font-display uppercase tracking-tight text-white">Customer Reviews</h2>
          <div className="flex items-center gap-2">
            <Stars rating={product.rating} size={15} />
            <span className="text-sm font-bold text-white">{product.rating}/5</span>
            <span className="text-sm text-zinc-500">· {product.reviewCount.toLocaleString()} reviews</span>
          </div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(reviews.length ? reviews : DEFAULT_REVIEWS).map((r) => (
            <article key={r.id} className="glass rounded-3xl p-5 hover:border-volt/25 transition-colors">
              <div className="flex items-center gap-2">
                <span className="text-lg" aria-hidden>{COUNTRY_FLAGS[r.country] || "🌍"}</span>
                <div>
                  <p className="text-sm font-bold text-white">
                    {r.name}
                    {r.verified && <span className="ml-1.5 text-[10px] text-volt font-bold uppercase tracking-wider">✓ Verified Buyer</span>}
                  </p>
                  <Stars rating={r.rating} size={10} />
                </div>
              </div>
              {r.title && <p className="text-sm font-bold text-zinc-200 mt-3">{r.title}</p>}
              <p className="text-sm text-zinc-400 mt-1.5 leading-relaxed">{r.content}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ===== Relacionados ===== */}
      {related.length > 0 && (
        <section className="mt-16 border-t border-white/10 pt-12" aria-label="You may also like">
          <h2 className="text-2xl font-black font-display uppercase tracking-tight text-white mb-7">
            You May Also Like <span className="text-gradient-ember">🔥</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
            {related.map((p) => (
              <motion.article
                key={p.id}
                onClick={() => onSelectProduct(p)}
                whileHover={{ y: -6 }}
                className="group cursor-pointer glass rounded-3xl overflow-hidden shine"
              >
                <div className="overflow-hidden">
                  <img src={p.image} alt={p.name} loading="lazy" className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-3.5">
                  <p className="text-sm font-bold text-zinc-100 line-clamp-1 font-display">{p.name}</p>
                  <p className="text-sm font-black text-volt font-display mt-0.5">{formatPrice(p.price, currency)}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

const DEFAULT_REVIEWS: Review[] = [
  {
    id: "d1", productId: "", name: "Tyler M.", country: "US", rating: 5, title: "Exactly as described",
    content: "Arrived in 9 days, great packaging, works perfectly. Would order again!", verified: true, createdAt: new Date().toISOString(),
  },
  {
    id: "d2", productId: "", name: "Priya S.", country: "GB", rating: 5, title: "Love it",
    content: "Second purchase from Bellviion — quality is consistently good and delivery to the UK is reliable.", verified: true, createdAt: new Date().toISOString(),
  },
  {
    id: "d3", productId: "", name: "Lucas B.", country: "CA", rating: 4, title: "Good value",
    content: "Does what it promises. Shipping to Canada took 11 days which is fair for free shipping.", verified: true, createdAt: new Date().toISOString(),
  },
]
