"use client"

import { useState, useEffect, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import type { Product, Order } from "@/lib/store-data"
import { useTracking } from "@/lib/cart-store"
import { StoreHeader } from "@/components/store/header"
import { StoreFooter } from "@/components/store/footer"
import { HomeView } from "@/components/store/home"
import { ShopView } from "@/components/store/shop"
import { ProductView } from "@/components/store/product-view"
import { CartView, CheckoutView, SuccessView } from "@/components/store/checkout"
import { AdminView } from "@/components/store/admin"
import { SocialProofPopup, NewsletterPopup } from "@/components/store/popups"
import { TrustBar } from "@/components/store/shared"

type View = "home" | "shop" | "product" | "cart" | "checkout" | "success" | "admin"

export function StoreRoot() {
  const searchParams = useSearchParams()
  const setTracking = useTracking((s) => s.setTracking)

  const [view, setView] = useState<View>("home")
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [reviews, setReviews] = useState<import("@/lib/store-data").Review[]>([])
  const [shopCategory, setShopCategory] = useState("all")
  const [shopSearch, setShopSearch] = useState("")
  const [lastOrder, setLastOrder] = useState<Order | null>(null)
  const [flashDeadline, setFlashDeadline] = useState(0)
  const [, setTick] = useState(0)
  const [announcement, setAnnouncement] = useState("🔥 FLASH SALE: Up to 50% OFF + FREE Worldwide Shipping — Ends Tonight!")
  const [loading, setLoading] = useState(true)

  // Captura parâmetros de afiliado/UTM da URL: ?ref=TIKTOK10&utm_source=tiktok
  useEffect(() => {
    const ref = searchParams.get("ref")
    const utmSource = searchParams.get("utm_source")
    const utmMedium = searchParams.get("utm_medium")
    const utmCampaign = searchParams.get("utm_campaign")
    if (ref || utmSource) {
      setTracking({ referralCode: ref, utmSource, utmMedium, utmCampaign })
      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "referral", referralCode: ref, utmSource, utmMedium, utmCampaign }),
      }).catch(() => {})
    }
  }, [searchParams])

  // Carrega produtos e settings
  const loadProducts = useCallback(async () => {
    try {
      const [pRes, sRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/settings"),
      ])
      const pData = await pRes.json()
      setProducts(pData.products || [])
      const sData = await sRes.json()
      if (sData.settings?.announcement) setAnnouncement(sData.settings.announcement)
    } catch (error) {
      console.error("Failed to load store data:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadProducts() }, [loadProducts])

  // Flash sale deadline persistente
  useEffect(() => {
    const key = "bv_flash_deadline"
    let deadline = parseInt(localStorage.getItem(key) || "0")
    if (!deadline || deadline < Date.now()) {
      deadline = Date.now() + 6 * 3600 * 1000
      localStorage.setItem(key, String(deadline))
    }
    setFlashDeadline(deadline)
  }, [])

  // Tick a cada segundo para o countdown
  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 1000)
    return () => clearInterval(t)
  }, [])

  const navigate = useCallback((v: string, data?: unknown) => {
    if (v === "shop") {
      if (typeof data === "string") {
        setShopCategory(data)
        setShopSearch("")
      }
      setView("shop")
    } else if (["home", "cart", "checkout", "admin"].includes(v)) {
      setView(v as View)
    }
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  const selectProduct = useCallback(async (p: Product) => {
    setSelectedProduct(p)
    setReviews([])
    setView("product")
    window.scrollTo({ top: 0, behavior: "smooth" })
    // Busca reviews do produto
    try {
      const res = await fetch(`/api/products/${p.id}`)
      const data = await res.json()
      if (data.product?.reviews) setReviews(data.product.reviews)
    } catch { /* usa reviews padrão */ }
  }, [])

  const handleSearch = useCallback((query: string) => {
    setShopSearch(query)
    setShopCategory("all")
    setView("shop")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  const relatedProducts = selectedProduct
    ? products.filter((p) => p.category === selectedProduct.category && p.id !== selectedProduct.id).slice(0, 4)
    : []

  return (
    <div className="min-h-screen flex flex-col bg-ink">
      <StoreHeader
        onNavigate={navigate}
        onSearch={handleSearch}
        flashDeadline={flashDeadline}
        announcement={announcement}
        onAdminClick={() => { setView("admin"); window.scrollTo({ top: 0 }) }}
      />

      <main className="flex-1" id="main-content">
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="w-10 h-10 border-4 border-volt/20 border-t-volt rounded-full animate-spin" aria-label="Loading" />
          </div>
        ) : (
          <>
            {view === "home" && (
              <HomeView
                products={products}
                flashDeadline={flashDeadline}
                onSelectProduct={selectProduct}
                onNavigate={navigate}
              />
            )}

            {view === "shop" && (
              <ShopView
                products={products}
                initialCategory={shopCategory}
                searchQuery={shopSearch}
                onSelectProduct={selectProduct}
              />
            )}

            {view === "product" && selectedProduct && (
              <div>
                <ProductView
                  product={selectedProduct}
                  reviews={reviews}
                  related={relatedProducts}
                  onBack={() => setView("shop")}
                  onSelectProduct={selectProduct}
                  onGoToCart={() => { setView("cart"); window.scrollTo({ top: 0 }) }}
                />
                <TrustBar />
              </div>
            )}

            {view === "cart" && (
              <CartView
                onContinue={() => navigate("shop")}
                onCheckout={() => { setView("checkout"); window.scrollTo({ top: 0 }) }}
              />
            )}

            {view === "checkout" && (
              <CheckoutView
                onSuccess={(order) => { setLastOrder(order); setView("success"); window.scrollTo({ top: 0 }) }}
              />
            )}

            {view === "success" && lastOrder && (
              <SuccessView order={lastOrder} onContinue={() => navigate("shop")} />
            )}

            {view === "admin" && (
              <div className="bg-zinc-100 text-zinc-900 min-h-screen">
                <AdminView onExit={() => { setView("home"); loadProducts() }} />
              </div>
            )}
          </>
        )}
      </main>

      {/* Elementos virais globais */}
      {view !== "admin" && <SocialProofPopup />}
      {view !== "admin" && <NewsletterPopup />}

      <StoreFooter onNavigate={navigate} />
    </div>
  )
}
