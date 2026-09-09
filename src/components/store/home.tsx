"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Flame, Zap, ShieldCheck, ChevronRight, Sparkles } from "lucide-react"
import type { Product } from "@/lib/store-data"
import { formatPrice } from "@/lib/store-data"
import { useCurrency } from "@/lib/cart-store"
import { ProductCard, Stars, CountdownTimer, Marquee } from "./shared"

interface HomeProps {
  products: Product[]
  flashDeadline: number
  onSelectProduct: (p: Product) => void
  onNavigate: (view: string, data?: unknown) => void
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const reveal = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.7, ease: EASE },
}

export function HomeView({ products, flashDeadline, onSelectProduct, onNavigate }: HomeProps) {
  const currency = useCurrency((s) => s.currency)
  const trending = products.filter((p) => p.isTrending).slice(0, 8)
  const deals = [...products].sort((a, b) => b.soldCount - a.soldCount).slice(0, 4)
  const [dealIndex, setDealIndex] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setDealIndex((i) => (i + 1) % Math.max(1, deals.length)), 4000)
    return () => clearInterval(t)
  }, [deals.length])

  const deal = deals[dealIndex]
  const heroProducts = products.slice(0, 4)

  return (
    <div className="relative">
      {/* ============ HERO CINÉTICO ============ */}
      <section className="relative overflow-hidden noise" aria-label="Hero">
        {/* Aurora blobs */}
        <div className="absolute -top-32 left-1/4 w-[560px] h-[560px] aurora-volt" aria-hidden />
        <div className="absolute top-40 -right-32 w-[480px] h-[480px] aurora-ember" aria-hidden />

        <div className="relative max-w-7xl mx-auto px-4 pt-16 pb-20 lg:pt-24 lg:pb-28">
          {/* Grid hero: texto + colagem */}
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-7"
            >
              <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-volt mb-7">
                <Sparkles className="w-3.5 h-3.5" /> #1 Trending Store — 50,000+ Customers
              </div>

              <h1 className="font-display font-black uppercase leading-[0.95] tracking-tight text-5xl sm:text-6xl lg:text-[5.2rem]">
                <span className="block text-white">Viral</span>
                <span className="block text-stroke">Products</span>
                <span className="block text-white">People Are</span>
                <span className="block text-gradient-volt">Obsessed With</span>
              </h1>

              <p className="text-zinc-400 mt-6 text-base lg:text-lg max-w-lg leading-relaxed">
                Hand-picked trending finds from TikTok &amp; Instagram — shipped fast to the{" "}
                <strong className="text-zinc-200">US, UK, Canada, Australia &amp; Europe</strong>.
                Secure PayPal checkout. 30-day money-back guarantee.
              </p>

              <div className="flex flex-wrap items-center gap-4 mt-9">
                <button
                  onClick={() => onNavigate("shop")}
                  className="group bg-volt text-zinc-950 px-8 py-4 rounded-full font-black font-display uppercase tracking-wide text-sm shadow-glow-volt hover:scale-105 active:scale-95 transition-transform flex items-center gap-2"
                >
                  Shop Trending Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <div className="flex items-center gap-2 text-sm text-zinc-400">
                  <Stars rating={4.8} size={15} />
                  <span><strong className="text-white">4.8/5</strong> from 28,000+ reviews</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-x-5 gap-y-2 mt-9 text-xs text-zinc-500">
                <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-volt" /> PayPal Buyer Protection</span>
                <span className="flex items-center gap-1.5">🚚 Free Shipping $35+</span>
                <span className="flex items-center gap-1.5">↩️ 30-Day Returns</span>
              </div>
            </motion.div>

            {/* Colagem flutuante */}
            <div className="hidden lg:block lg:col-span-5 relative h-[560px]">
              {heroProducts.map((p, i) => {
                const positions = [
                  "top-0 left-4 rotate-[-4deg]",
                  "top-10 right-0 rotate-[3deg]",
                  "bottom-24 left-0 rotate-[2deg]",
                  "bottom-0 right-8 rotate-[-3deg]",
                ]
                const delays = ["0s", "1.2s", "2.1s", "0.6s"]
                return (
                  <motion.button
                    key={p.id}
                    onClick={() => onSelectProduct(p)}
                    initial={{ opacity: 0, y: 40, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={{ scale: 1.07, rotate: 0, zIndex: 20 }}
                    className={`absolute ${positions[i]} w-56 rounded-3xl overflow-hidden glass shadow-2xl shadow-black/60 animate-float`}
                    style={{ animationDelay: delays[i] }}
                    aria-label={`View ${p.name}`}
                  >
                    <img src={p.image} alt={p.name} className="w-full aspect-square object-cover" />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink via-ink/60 to-transparent p-3.5 text-left">
                      <p className="text-[11px] font-bold text-white line-clamp-1 font-display uppercase">{p.name}</p>
                      <p className="text-sm font-black text-volt font-display">{formatPrice(p.price, currency)}</p>
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ============ MARQUEE ============ */}
      <Marquee
        items={[
          "Free Worldwide Shipping $35+",
          "PayPal Secure Checkout",
          "50,000+ Happy Customers",
          "30-Day Money-Back Guarantee",
          "New Viral Drops Every Week",
        ]}
      />

      {/* ============ FLASH DEAL BAR ============ */}
      {deal && (
        <section className="bg-ember text-white relative overflow-hidden" aria-label="Flash deal">
          <div className="absolute inset-0 bg-[repeating-linear-gradient(-45deg,transparent,transparent_14px,rgba(0,0,0,0.07)_14px,rgba(0,0,0,0.07)_28px)]" aria-hidden />
          <div className="relative max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4 text-sm">
            <div className="flex items-center gap-3 min-w-0">
              <span className="bg-white text-ember font-black font-display text-xs px-2.5 py-1 rounded-full uppercase shrink-0">Flash Deal</span>
              <span className="truncate font-semibold">{deal.name} — <span className="font-black">{formatPrice(deal.price, currency)}</span></span>
            </div>
            <div className="flex items-center gap-2 shrink-0 text-xs font-semibold">
              <Zap className="w-4 h-4 text-volt" /> Ends in <CountdownTimer deadline={flashDeadline} />
            </div>
          </div>
        </section>
      )}

      {/* ============ TRENDING BENTO ============ */}
      <section className="max-w-7xl mx-auto px-4 py-16 lg:py-20" aria-label="Trending products">
        <motion.div {...reveal} className="flex items-end justify-between mb-9">
          <div>
            <p className="text-[11px] font-black text-volt uppercase tracking-[0.3em] mb-2 flex items-center gap-2">
              <Flame className="w-4 h-4" /> Going Viral
            </p>
            <h2 className="text-3xl sm:text-4xl font-black font-display uppercase tracking-tight text-white">
              Trending <span className="text-stroke">Right Now</span>
            </h2>
            <p className="text-sm text-zinc-500 mt-2">What everyone is buying this week</p>
          </div>
          <button
            onClick={() => onNavigate("shop")}
            className="hidden sm:flex items-center gap-1 text-sm font-bold text-volt hover:gap-2 transition-all"
          >
            View all <ChevronRight className="w-4 h-4" />
          </button>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {trending.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.55, delay: (i % 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <ProductCard product={p} onSelect={onSelectProduct} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ============ CATEGORIAS ============ */}
      <section className="py-14 border-y border-white/5 bg-ink-2/60" aria-label="Shop by category">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div {...reveal} className="text-center mb-9">
            <p className="text-[11px] font-black text-volt uppercase tracking-[0.3em] mb-2">Explore</p>
            <h2 className="text-3xl sm:text-4xl font-black font-display uppercase tracking-tight text-white">
              Shop by <span className="text-stroke">Category</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
            {[
              { id: "tech", icon: "📱", label: "Tech & Gadgets" },
              { id: "home", icon: "🏠", label: "Home & Living" },
              { id: "beauty", icon: "💄", label: "Beauty & Care" },
              { id: "fitness", icon: "💪", label: "Fitness" },
              { id: "pets", icon: "🐾", label: "Pet Lovers" },
              { id: "fashion", icon: "👟", label: "Fashion" },
            ].map((cat, i) => (
              <motion.button
                key={cat.id}
                {...reveal}
                transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => onNavigate("shop", cat.id)}
                className="group glass rounded-3xl p-5 sm:p-7 hover:border-volt/50 hover:bg-volt/5 transition-all text-center"
              >
                <span className="text-3xl sm:text-4xl block group-hover:scale-125 group-hover:-rotate-6 transition-transform duration-300" aria-hidden>{cat.icon}</span>
                <p className="text-xs sm:text-sm font-bold text-zinc-200 mt-3 font-display">{cat.label}</p>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* ============ STATS ============ */}
      <section className="max-w-7xl mx-auto px-4 py-16 lg:py-20" aria-label="Store statistics">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { value: "50,000+", label: "Orders Delivered", icon: "📦" },
            { value: "48", label: "Countries Served", icon: "🌍" },
            { value: "4.8/5", label: "Average Rating", icon: "⭐" },
            { value: "98.2%", label: "Would Recommend", icon: "❤️" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              {...reveal}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="glass rounded-3xl p-6 sm:p-8 text-center hover:border-volt/30 transition-colors"
            >
              <span className="text-2xl" aria-hidden>{stat.icon}</span>
              <p className="text-3xl sm:text-4xl font-black font-display mt-3 text-gradient-volt">
                {stat.value}
              </p>
              <p className="text-[11px] text-zinc-500 mt-2 uppercase tracking-widest font-bold">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ============ MELHORES VENDAS ============ */}
      <section className="max-w-7xl mx-auto px-4 pb-16" aria-label="Best sellers">
        <motion.div {...reveal} className="flex items-end justify-between mb-9">
          <div>
            <p className="text-[11px] font-black text-volt uppercase tracking-[0.3em] mb-2">🏆 Customer Favorites</p>
            <h2 className="text-3xl sm:text-4xl font-black font-display uppercase tracking-tight text-white">
              Best Sellers <span className="text-stroke">of 2026</span>
            </h2>
          </div>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
          {deals.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <ProductCard product={p} onSelect={onSelectProduct} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ============ TESTEMUNHOS ============ */}
      <section className="border-t border-white/5 bg-ink-2/60" aria-label="Customer reviews">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <motion.div {...reveal} className="text-center mb-10">
            <p className="text-[11px] font-black text-volt uppercase tracking-[0.3em] mb-2">Verified Reviews</p>
            <h2 className="text-3xl sm:text-4xl font-black font-display uppercase tracking-tight text-white">
              What Customers <span className="text-stroke">Say</span>
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                name: "Amanda R.", country: "US", flag: "🇺🇸", product: "Galaxy Star Projector",
                text: "Ordered on Tuesday, arrived the following week in perfect condition. My son hasn't slept without it since. The quality honestly rivals what you'd find on Amazon for double the price.",
              },
              {
                name: "James W.", country: "GB", flag: "🇬🇧", product: "Cloud Slippers",
                text: "Was worried about ordering from a new store, but PayPal made it risk-free. Slippers are incredibly comfy, sizing was accurate, and the delivery updates were excellent throughout.",
              },
              {
                name: "Sophie T.", country: "AU", flag: "🇦🇺", product: "Ice Roller",
                text: "The ice roller has become part of my daily routine — so refreshing in the Australian summer! Will definitely be back to try the sunset lamp for my room makeover.",
              },
            ].map((t, i) => (
              <motion.figure
                key={t.name}
                {...reveal}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="glass rounded-3xl p-6 hover:border-volt/30 transition-colors"
              >
                <Stars rating={5} size={13} />
                <blockquote className="text-sm text-zinc-300 mt-4 leading-relaxed">
                  &ldquo;{t.text}&rdquo;
                </blockquote>
                <figcaption className="flex items-center gap-3 mt-5 pt-4 border-t border-white/5">
                  <span className="text-xl" aria-hidden>{t.flag}</span>
                  <div>
                    <p className="text-sm font-bold text-white">
                      {t.name} <span className="ml-1 text-[10px] text-volt font-bold uppercase tracking-wider">✓ Verified</span>
                    </p>
                    <p className="text-xs text-zinc-500">Purchased: {t.product}</p>
                  </div>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
