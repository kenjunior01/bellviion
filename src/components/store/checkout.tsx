"use client"

import { useState, useEffect } from "react"
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Lock, Truck, ShieldCheck, Gift, Loader2, CheckCircle2, PartyPopper, Copy } from "lucide-react"
import type { Product, Order } from "@/lib/store-data"
import { formatPrice, TOP_COUNTRIES } from "@/lib/store-data"
import { useCart, useCurrency, useTracking } from "@/lib/cart-store"
import { toast } from "sonner"
import { motion } from "framer-motion"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const FREE_SHIPPING_THRESHOLD = 35

const inputCls = "px-4 py-3.5 text-sm bg-white/5 rounded-2xl border border-white/10 text-white placeholder:text-zinc-500 focus:bg-white/10 focus:border-volt/50 focus:ring-2 focus:ring-volt/20 outline-none transition-all w-full"

// ============================================================
// CARRINHO
// ============================================================
export function CartView({ onContinue, onCheckout }: { onContinue: () => void; onCheckout: () => void }) {
  const { items, updateQuantity, removeItem } = useCart()
  const currency = useCurrency((s) => s.currency)

  const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0)
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-28 text-center relative">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[400px] h-[400px] aurora-volt opacity-50" aria-hidden />
        <div className="relative">
          <ShoppingBag className="w-20 h-20 text-zinc-700 mx-auto mb-6" />
          <h1 className="text-3xl sm:text-4xl font-black font-display uppercase tracking-tight text-white">Your cart is empty</h1>
          <p className="text-zinc-500 mt-3 mb-9">Add some viral finds to get started 🛍️</p>
          <button
            onClick={onContinue}
            className="bg-volt text-zinc-950 px-9 py-4 rounded-full font-black font-display uppercase tracking-wide shadow-glow-volt hover:scale-105 transition-transform"
          >
            Shop Trending Products
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-black font-display uppercase tracking-tight text-white mb-8">
        Cart <span className="text-stroke">({items.reduce((a, i) => a + i.quantity, 0)})</span>
      </h1>

      {/* Barra de frete grátis */}
      <div className="glass rounded-2xl p-4 mb-7 border-volt/20">
        <p className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
          <Truck className="w-4 h-4 text-volt" />
          {remaining > 0 ? (
            <>Add <strong className="text-volt">{formatPrice(remaining, currency)}</strong> more to unlock <strong>FREE Shipping</strong> 🚚</>
          ) : (
            <>🎉 You unlocked <strong className="text-volt">FREE Worldwide Shipping!</strong></>
          )}
        </p>
        <Progress value={progress} className="h-2 mt-3 bg-white/10 [&>div]:bg-volt" />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Itens */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.productId} className="flex gap-4 glass rounded-3xl p-4">
              <img src={item.image} alt={item.name} className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-bold font-display text-sm text-white line-clamp-2">{item.name}</p>
                <p className="text-volt font-black font-display text-sm mt-1">{formatPrice(item.price, currency)}</p>
                <div className="flex items-center gap-3 mt-2.5">
                  <div className="flex items-center border border-white/10 rounded-full overflow-hidden">
                    <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="px-2.5 py-1.5 hover:bg-white/5 text-zinc-300" aria-label="Decrease">
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-black text-white">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="px-2.5 py-1.5 hover:bg-white/5 text-zinc-300" aria-label="Increase">
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <button
                    onClick={() => { removeItem(item.productId); toast("Item removed") }}
                    className="text-xs text-zinc-500 hover:text-ember flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove
                  </button>
                </div>
              </div>
              <p className="font-black font-display text-white text-right shrink-0">{formatPrice(item.price * item.quantity, currency)}</p>
            </div>
          ))}
        </div>

        {/* Resumo */}
        <div className="glass rounded-3xl p-6 h-fit sticky top-32 border-volt/20">
          <h2 className="font-black font-display uppercase tracking-wide text-white mb-5">Order Summary</h2>
          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between"><span className="text-zinc-500">Subtotal</span><span className="font-bold text-white">{formatPrice(subtotal, currency)}</span></div>
            <div className="flex justify-between"><span className="text-zinc-500">Shipping</span><span className="font-bold text-volt">{subtotal >= FREE_SHIPPING_THRESHOLD ? "FREE" : formatPrice(4.99, currency)}</span></div>
          </div>
          <div className="flex justify-between items-baseline border-t border-white/10 mt-5 pt-5">
            <span className="font-black font-display uppercase text-white">Total</span>
            <span className="text-3xl font-black font-display text-volt">
              {formatPrice(subtotal + (subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 4.99), currency)}
            </span>
          </div>
          <button
            onClick={onCheckout}
            className="w-full mt-7 bg-volt text-zinc-950 font-black font-display uppercase tracking-wide py-4 rounded-2xl glow-volt hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            Secure Checkout <ArrowRight className="w-5 h-5" />
          </button>
          <p className="text-[11px] text-center text-zinc-500 mt-4 flex items-center justify-center gap-1">
            <Lock className="w-3 h-3" /> Encrypted PayPal checkout · Buyer protection
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// CHECKOUT
// ============================================================
export function CheckoutView({ onSuccess }: { onSuccess: (order: Order) => void }) {
  const { items, clearCart } = useCart()
  const currency = useCurrency((s) => s.currency)
  const tracking = useTracking()

  const [form, setForm] = useState({
    customerName: "", email: "", phone: "", country: "US", state: "", city: "", address1: "", address2: "", zipCode: "",
  })
  const [placing, setPlacing] = useState(false)
  const [paypalStatus, setPaypalStatus] = useState<{ configured: boolean; mode: string } | null>(null)

  const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0)
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 4.99
  const total = subtotal + shipping

  useEffect(() => {
    fetch("/api/paypal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "status" }),
    })
      .then((r) => r.json())
      .then((d) => setPaypalStatus({ configured: d.configured, mode: d.mode }))
      .catch(() => setPaypalStatus({ configured: false, mode: "sandbox" }))
  }, [])

  const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }))

  const placeOrder = async () => {
    if (!form.customerName || !form.email || !form.city || !form.address1 || !form.zipCode) {
      toast.error("Please fill in all required fields")
      return
    }
    setPlacing(true)
    try {
      // 1. Cria pedido no servidor
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          currency,
          exchangeRate: 1,
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
          referralCode: tracking.referralCode,
          utmSource: tracking.utmSource,
          utmMedium: tracking.utmMedium,
          utmCampaign: tracking.utmCampaign,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to create order")

      const order: Order = data.order

      // 2. Processa pagamento (real PayPal ou modo demo)
      await fetch("/api/paypal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "capture", localOrderId: order.id }),
      })

      clearCart()
      onSuccess(order)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Checkout failed")
    } finally {
      setPlacing(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-28 text-center">
        <ShoppingBag className="w-20 h-20 text-zinc-700 mx-auto mb-6" />
        <h1 className="text-3xl font-black font-display uppercase tracking-tight text-white">Nothing to checkout</h1>
        <p className="text-zinc-500 mt-3">Your cart is empty.</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-black font-display uppercase tracking-tight text-white mb-3">Secure Checkout</h1>
      <p className="text-sm text-zinc-500 mb-9 flex items-center gap-1.5">
        <Lock className="w-4 h-4 text-volt" /> Your information is encrypted and protected by PayPal
      </p>

      {paypalStatus && !paypalStatus.configured && (
        <div className="mb-7 bg-volt/10 border border-volt/30 rounded-2xl p-4 text-sm text-volt flex items-start gap-3">
          <Gift className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="text-zinc-300">
            <strong className="text-volt">Demo payment mode:</strong> PayPal credentials are not configured yet. Orders will be simulated successfully so you can test the full flow.
            Configure your PayPal Client ID in the Admin panel to accept real payments.
          </p>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Formulário */}
        <div className="lg:col-span-2 space-y-5">
          <section className="glass rounded-3xl p-6" aria-label="Contact information">
            <h2 className="font-black font-display uppercase tracking-wide text-white mb-5 flex items-center gap-2.5">
              <span className="w-7 h-7 bg-volt text-zinc-950 rounded-full text-xs flex items-center justify-center font-black">1</span>
              Contact Information
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <input required placeholder="Full name *" value={form.customerName} onChange={(e) => update("customerName", e.target.value)} className={inputCls} />
              <input required type="email" placeholder="Email *" value={form.email} onChange={(e) => update("email", e.target.value)} className={inputCls} />
              <input placeholder="Phone (for delivery updates)" value={form.phone} onChange={(e) => update("phone", e.target.value)} className={inputCls} />
            </div>
          </section>

          <section className="glass rounded-3xl p-6" aria-label="Shipping address">
            <h2 className="font-black font-display uppercase tracking-wide text-white mb-5 flex items-center gap-2.5">
              <span className="w-7 h-7 bg-volt text-zinc-950 rounded-full text-xs flex items-center justify-center font-black">2</span>
              Shipping Address
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Select value={form.country} onValueChange={(v) => { update("country", v); const c = TOP_COUNTRIES.find((x) => x.code === v); if (c) toast(`${c.flag} Shipping to ${c.name}`) }}>
                  <SelectTrigger className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 text-white" aria-label="Country">
                    <SelectValue placeholder="Country *" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-white/10 max-h-72">
                    {TOP_COUNTRIES.map((c) => (
                      <SelectItem key={c.code} value={c.code}>{c.flag} {c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <input placeholder="City *" value={form.city} onChange={(e) => update("city", e.target.value)} className={inputCls} />
              <input placeholder="State / Province" value={form.state} onChange={(e) => update("state", e.target.value)} className={inputCls} />
              <input placeholder="Street address *" value={form.address1} onChange={(e) => update("address1", e.target.value)} className={inputCls + " sm:col-span-2"} />
              <input placeholder="Apartment, suite, etc. (optional)" value={form.address2} onChange={(e) => update("address2", e.target.value)} className={inputCls + " sm:col-span-2"} />
              <input placeholder="ZIP / Postal code *" value={form.zipCode} onChange={(e) => update("zipCode", e.target.value)} className={inputCls} />
            </div>
          </section>

          <section className="glass rounded-3xl p-6" aria-label="Payment method">
            <h2 className="font-black font-display uppercase tracking-wide text-white mb-5 flex items-center gap-2.5">
              <span className="w-7 h-7 bg-volt text-zinc-950 rounded-full text-xs flex items-center justify-center font-black">3</span>
              Payment
            </h2>
            <div className="border-2 border-volt/50 bg-volt/5 rounded-2xl p-4 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-volt" />
              <div className="flex-1">
                <p className="font-bold text-sm text-white">PayPal</p>
                <p className="text-xs text-zinc-400">Pay with your PayPal balance, credit or debit card — buyer protection included.</p>
              </div>
              <span className="font-black italic text-lg text-[#8ab4ff]">Pay<span className="text-[#c7e2ff]">Pal</span></span>
            </div>
            {tracking.referralCode && (
              <p className="text-xs text-zinc-500 mt-4 flex items-center gap-1">
                <Gift className="w-3.5 h-3.5 text-volt" /> Referral code <strong className="text-volt">{tracking.referralCode}</strong> will be applied
              </p>
            )}
          </section>
        </div>

        {/* Resumo do pedido */}
        <div className="glass rounded-3xl p-6 h-fit sticky top-32 border-volt/20">
          <h2 className="font-black font-display uppercase tracking-wide text-white mb-5">Your Order</h2>
          <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
            {items.map((item) => (
              <div key={item.productId} className="flex gap-3 items-center">
                <div className="relative shrink-0">
                  <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover" />
                  <span className="absolute -top-1.5 -right-1.5 bg-volt text-zinc-950 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">{item.quantity}</span>
                </div>
                <p className="text-xs font-semibold text-zinc-300 flex-1 line-clamp-2">{item.name}</p>
                <p className="text-xs font-black text-white">{formatPrice(item.price * item.quantity, currency)}</p>
              </div>
            ))}
          </div>
          <div className="space-y-2.5 text-sm border-t border-white/10 mt-5 pt-5">
            <div className="flex justify-between"><span className="text-zinc-500">Subtotal</span><span className="font-bold text-white">{formatPrice(subtotal, currency)}</span></div>
            <div className="flex justify-between"><span className="text-zinc-500">Shipping</span><span className="font-bold text-volt">{shipping === 0 ? "FREE" : formatPrice(shipping, currency)}</span></div>
          </div>
          <div className="flex justify-between items-baseline border-t border-white/10 mt-5 pt-5">
            <span className="font-black font-display uppercase text-white">Total</span>
            <span className="text-3xl font-black font-display text-volt">{formatPrice(total, currency)}</span>
          </div>
          <button
            onClick={placeOrder}
            disabled={placing}
            className="w-full mt-6 bg-volt text-zinc-950 font-black font-display uppercase tracking-wide py-4 rounded-2xl glow-volt hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {placing ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</> : <><Lock className="w-4 h-4" /> Pay {formatPrice(total, currency)}</>}
          </button>
          <p className="text-[11px] text-center text-zinc-500 mt-4 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-volt" /> 30-day money-back guarantee
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// SUCESSO
// ============================================================
export function SuccessView({ order, onContinue }: { order: Order; onContinue: () => void }) {
  const copyEmail = () => {
    navigator.clipboard?.writeText(order.email).catch(() => {})
    toast.success("Email copied!")
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center relative">
      <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[480px] h-[480px] aurora-volt" aria-hidden />
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative"
      >
        <div className="w-24 h-24 bg-volt rounded-full flex items-center justify-center mx-auto mb-7 glow-volt">
          <PartyPopper className="w-12 h-12 text-zinc-950" />
        </div>
        <h1 className="text-4xl font-black font-display uppercase tracking-tight text-white">Order Confirmed! 🎉</h1>
        <p className="text-zinc-400 mt-4 leading-relaxed">
          Thank you, <strong className="text-white">{order.customerName}</strong>! Your order is being processed
          and you&apos;ll receive a confirmation email with tracking details soon.
        </p>

        <div className="glass rounded-3xl p-6 mt-9 text-left">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div>
              <p className="text-xs text-zinc-500">Order number</p>
              <p className="font-black font-display text-white text-lg">{order.orderNumber}</p>
            </div>
            <span className="bg-volt/15 text-volt border border-volt/30 text-xs font-black px-3 py-1.5 rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> PAID
            </span>
          </div>
          <div className="py-4 space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-3 items-center">
                <img src={item.image || ""} alt={item.name} className="w-12 h-12 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-zinc-200 line-clamp-1">{item.name}</p>
                  <p className="text-xs text-zinc-500">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-black text-white">${(item.unitPrice * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="pt-4 border-t border-white/10 flex justify-between items-baseline">
            <span className="font-black font-display uppercase text-white">Total Paid</span>
            <span className="text-3xl font-black font-display text-volt">${order.total.toFixed(2)}</span>
          </div>
          <div className="mt-5 bg-volt/10 border border-volt/20 rounded-2xl p-3.5 text-xs text-zinc-300 flex items-start gap-2">
            <Truck className="w-4 h-4 shrink-0 mt-0.5 text-volt" />
            Estimated delivery: 7–14 business days with tracking to {order.city}, {order.country}. We&apos;ll email you the tracking number as soon as it ships.
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-9 justify-center">
          <button
            onClick={onContinue}
            className="bg-volt text-zinc-950 px-8 py-4 rounded-full font-black font-display uppercase tracking-wide shadow-glow-volt hover:scale-105 transition-transform"
          >
            Continue Shopping
          </button>
          <button
            onClick={copyEmail}
            className="border-2 border-white/15 text-zinc-300 px-8 py-4 rounded-full font-bold hover:bg-white/5 transition-colors flex items-center justify-center gap-2"
          >
            <Copy className="w-4 h-4" /> Copy Confirmation Email
          </button>
        </div>

        <p className="text-sm text-zinc-500 mt-7">
          Share your find with friends — they get 10% off too! 🎁
        </p>
      </motion.div>
    </div>
  )
}
