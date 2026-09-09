"use client"

import { Star, Flame, TrendingUp, Sparkles, BadgePercent, Zap, Eye } from "lucide-react"
import { motion } from "framer-motion"
import { formatPrice, discountPercent, type Product } from "@/lib/store-data"
import { useCurrency } from "@/lib/cart-store"

// ============================================================
// Estrelas de avaliação
// ============================================================
export function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`Rated ${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          style={{ width: size, height: size }}
          className={
            i <= Math.round(rating)
              ? "fill-volt text-volt"
              : "fill-zinc-700 text-zinc-700"
          }
        />
      ))}
    </div>
  )
}

// ============================================================
// Badge de produto (VIRAL, BESTSELLER, etc)
// ============================================================
export function ProductBadge({ badge }: { badge: string | null }) {
  if (!badge) return null
  const styles: Record<string, { className: string; icon: React.ReactNode }> = {
    VIRAL: { className: "bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white", icon: <Flame className="w-3 h-3" /> },
    BESTSELLER: { className: "bg-volt text-zinc-950", icon: <TrendingUp className="w-3 h-3" /> },
    TRENDING: { className: "bg-gradient-to-r from-emerald-400 to-teal-400 text-zinc-950", icon: <TrendingUp className="w-3 h-3" /> },
    NEW: { className: "bg-white text-zinc-950", icon: <Sparkles className="w-3 h-3" /> },
    "SUMMER HOT": { className: "bg-gradient-to-r from-ember to-orange-400 text-white", icon: <Zap className="w-3 h-3" /> },
  }
  const style = styles[badge] || { className: "bg-white text-zinc-950", icon: null }
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-normal shadow-lg max-w-full ${style.className}`}>
      <span className="shrink-0">{style.icon}</span>
      <span className="truncate">{badge}</span>
    </span>
  )
}

// ============================================================
// Card de produto — glass dark, tilt 3D, shine sweep
// ============================================================
export function ProductCard({ product, onSelect }: { product: Product; onSelect: (p: Product) => void }) {
  const currency = useCurrency((s) => s.currency)
  const discount = discountPercent(product.price, product.compareAtPrice)

  return (
    <motion.article
      whileHover="hover"
      initial="rest"
      animate="rest"
      className="group relative rounded-3xl overflow-hidden cursor-pointer glass shine flex flex-col hover:border-volt/40 transition-colors duration-300"
      onClick={() => onSelect(product)}
      itemScope
      itemType="https://schema.org/Product"
    >
      <meta itemProp="name" content={product.name} />
      <motion.div
        variants={{ rest: { scale: 1 }, hover: { scale: 1.06 } }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative aspect-square overflow-hidden bg-ink-3"
      >
        <img
          src={product.image}
          alt={product.name}
          itemProp="image"
          loading="lazy"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" aria-hidden />
      </motion.div>

      <div className="absolute top-3.5 left-3.5 flex flex-col gap-1.5 max-w-[calc(100%-5.5rem)]">
        <ProductBadge badge={product.badge} />
      </div>
      {discount > 0 && (
        <span className="absolute top-3.5 right-3.5 bg-ember text-white text-[11px] font-black px-2.5 py-1 rounded-full shadow-glow-ember">
          −{discount}%
        </span>
      )}
      {product.stock <= 25 && (
        <span className="absolute top-12 left-3.5 bg-ink/80 text-volt text-[10px] font-bold px-2 py-1 rounded-full backdrop-blur border border-white/10">
          Only {product.stock} left
        </span>
      )}

      <div className="relative p-4 pt-3 flex flex-col gap-1.5 flex-1 -mt-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <Stars rating={product.rating} size={11} />
          <span className="text-[11px] text-zinc-500">({product.reviewCount.toLocaleString()})</span>
          <span className="ml-auto text-[10px] font-semibold text-zinc-500 flex items-center gap-1">
            <Eye className="w-3 h-3" /> {product.soldCount.toLocaleString()}+ sold
          </span>
        </div>
        <h3 className="font-display font-semibold text-sm text-zinc-100 line-clamp-2 leading-snug" itemProp="description">
          {product.name}
        </h3>
        <div className="mt-auto flex items-baseline gap-2 pt-2">
          <span className="text-lg font-black text-white font-display">{formatPrice(product.price, currency)}</span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="text-xs text-zinc-500 line-through">
              {formatPrice(product.compareAtPrice, currency)}
            </span>
          )}
        </div>
        <div className="text-[10px] font-bold text-volt/90 flex items-center gap-1 uppercase tracking-wider">
          <BadgePercent className="w-3 h-3" /> Free Worldwide Shipping
        </div>
      </div>

      {/* Hover CTA */}
      <motion.div
        variants={{ rest: { opacity: 0, y: 8 }, hover: { opacity: 1, y: 0 } }}
        transition={{ duration: 0.25 }}
        className="absolute inset-x-3 bottom-3 rounded-2xl bg-volt text-zinc-950 text-center text-xs font-black uppercase tracking-wider py-3 opacity-0 pointer-events-none"
        aria-hidden
      >
        View Product →
      </motion.div>
    </motion.article>
  )
}

// ============================================================
// Marquee de confiança (faixa rolante, loop sem emenda)
// ============================================================
export function Marquee({ items, variant = "volt" }: { items: string[]; variant?: "volt" | "ember" | "ghost" }) {
  const row = (hidden: boolean) => (
    <div className="flex items-center gap-6 pr-6 shrink-0" aria-hidden={hidden || undefined}>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-6 shrink-0">
          <span className="font-display font-bold uppercase tracking-wide text-sm whitespace-nowrap">{item}</span>
          <span className={`text-lg ${variant === "volt" ? "text-zinc-950/60" : "text-volt"}`} aria-hidden>✦</span>
        </span>
      ))}
    </div>
  )
  return (
    <div
      className={`relative overflow-hidden py-3 border-y ${
        variant === "volt"
          ? "bg-volt text-zinc-950 border-volt"
          : variant === "ember"
            ? "bg-ember text-white border-ember"
            : "glass text-zinc-300 border-white/10"
      }`}
      aria-hidden
    >
      <div className={`flex w-max ${variant === "volt" ? "animate-marquee" : "animate-marquee-fast"}`}>
        {row(false)}
        {row(true)}
      </div>
    </div>
  )
}

// ============================================================
// Barra de confiança
// ============================================================
export function TrustBar() {
  const items = [
    { icon: "🔒", title: "PayPal Secure Checkout", sub: "Buyer protection included" },
    { icon: "🚚", title: "Free Worldwide Shipping", sub: "On orders over $35" },
    { icon: "↩️", title: "30-Day Guarantee", sub: "Easy returns, no questions" },
    { icon: "⭐", title: "50,000+ Happy Customers", sub: "4.8/5 average rating" },
  ]
  return (
    <section className="glass border-x-0 border-b-0" aria-label="Store guarantees">
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item) => (
          <div key={item.title} className="flex items-center gap-3">
            <span className="text-2xl shrink-0" aria-hidden>{item.icon}</span>
            <div>
              <p className="text-xs font-bold leading-tight text-white">{item.title}</p>
              <p className="text-[11px] text-zinc-500 leading-tight mt-0.5">{item.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ============================================================
// Countdown timer (urgência)
// ============================================================
export function CountdownTimer({ deadline }: { deadline: number }) {
  const remaining = Math.max(0, deadline - Date.now())
  const h = Math.floor(remaining / 3600000)
  const m = Math.floor((remaining % 3600000) / 60000)
  const s = Math.floor((remaining % 60000) / 1000)
  const pad = (n: number) => String(n).padStart(2, "0")
  return (
    <span className="font-mono font-bold tabular-nums">
      {pad(h)}:{pad(m)}:{pad(s)}
    </span>
  )
}

// ============================================================
// Popup de prova social
// ============================================================
const POPUP_PRODUCTS = [
  "CloudWalk Ultra-Soft Cloud Slippers",
  "Nebula Galaxy Star Projector",
  "CryoGlow Ice Roller & Face Sculptor",
  "Aurora Sunset Projection Lamp",
  "GentlePet Deshedding Glove",
]

export function randomProof() {
  const locations = [
    "New York, US", "London, GB", "Los Angeles, US", "Toronto, CA", "Sydney, AU",
    "Berlin, DE", "Chicago, US", "Manchester, GB", "Paris, FR", "Melbourne, AU",
    "Vancouver, CA", "Munich, DE", "Austin, US", "Dublin, IE", "Auckland, NZ",
  ]
  const location = locations[Math.floor(Math.random() * locations.length)]
  const product = POPUP_PRODUCTS[Math.floor(Math.random() * POPUP_PRODUCTS.length)]
  return { location, product }
}
