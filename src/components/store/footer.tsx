"use client"

import { useState } from "react"
import { Facebook, Twitter, Instagram, Youtube, Mail, Send, CreditCard, ShieldCheck, Truck } from "lucide-react"
import { toast } from "sonner"

const SEO_LINKS = {
  "Trending Now": ["Viral TikTok Products", "Best Sellers", "New Arrivals", "Gifts Under $25", "Flash Deals"],
  Categories: ["Tech & Gadgets", "Home & Living", "Beauty & Care", "Fitness", "Pet Lovers", "Fashion"],
  "Customer Care": ["Shipping Information", "Returns & Refunds", "Track Your Order", "FAQ", "Contact Us"],
}

export function StoreFooter({ onNavigate }: { onNavigate: (view: string, data?: unknown) => void }) {
  const [email, setEmail] = useState("")
  const [subscribing, setSubscribing] = useState(false)

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setSubscribing(true)
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "footer" }),
      })
      if (res.ok) {
        toast.success("🎉 You're in! Check your inbox for your 10% off code.")
        setEmail("")
      } else {
        toast.error("Please enter a valid email address.")
      }
    } finally {
      setSubscribing(false)
    }
  }

  return (
    <footer className="relative bg-ink-2 border-t border-white/10 text-zinc-300 mt-auto noise overflow-hidden">
      {/* Newsletter */}
      <section className="border-b border-white/10 relative" aria-label="Newsletter signup">
        <div className="max-w-7xl mx-auto px-4 py-14 flex flex-col lg:flex-row items-center gap-8">
          <div className="flex-1 text-center lg:text-left">
            <p className="text-[10px] font-bold text-volt uppercase tracking-[0.3em] mb-2">Newsletter</p>
            <h2 className="text-3xl sm:text-4xl font-black font-display text-white leading-tight">
              Join 80,000+ <span className="text-gradient-volt">deal hunters</span>
            </h2>
            <p className="text-sm text-zinc-400 mt-3 max-w-md mx-auto lg:mx-0">
              Get exclusive discounts, new viral drops before anyone else, and a <strong className="text-volt">10% off</strong> coupon for your first order.
            </p>
          </div>
          <form onSubmit={subscribe} className="w-full max-w-md flex gap-2">
            <div className="relative flex-1">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-zinc-500 text-sm outline-none focus:border-volt/50 focus:ring-2 focus:ring-volt/20 transition-all"
                aria-label="Email address"
              />
            </div>
            <button
              type="submit"
              disabled={subscribing}
              className="bg-volt text-zinc-950 px-6 py-3.5 rounded-2xl font-black text-sm hover:glow-volt disabled:opacity-50 transition-all font-display uppercase tracking-wide flex items-center gap-2"
            >
              {subscribing ? "..." : <><Send className="w-4 h-4" /> Get 10% Off</>}
            </button>
          </form>
        </div>
      </section>

      {/* Links */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
        <div className="col-span-2 md:col-span-4 lg:col-span-1">
          <p className="text-xl font-black font-display text-white">
            BELLVII<span className="text-volt">O</span>N
          </p>
          <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
            Viral finds, premium quality, delivered worldwide. Trusted checkout via PayPal.
          </p>
          <div className="flex gap-2 mt-4">
            {[
              { icon: Facebook, label: "Facebook" },
              { icon: Instagram, label: "Instagram" },
              { icon: Twitter, label: "Twitter" },
              { icon: Youtube, label: "YouTube" },
            ].map(({ icon: Icon, label }) => (
              <a
                key={label}
                href="https://www.tiktok.com" // substituir pelos perfis reais
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-volt hover:text-zinc-950 hover:border-volt transition-all text-zinc-400"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        {Object.entries(SEO_LINKS).map(([title, links]) => (
          <nav key={title} aria-label={title}>
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-3">{title}</h3>
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link}>
                  <button
                    onClick={() => onNavigate("shop")}
                    className="text-xs text-zinc-500 hover:text-volt transition-colors"
                  >
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <nav aria-label="Payment methods">
          <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-3">We Accept</h3>
          <div className="space-y-2">
            <p className="flex items-center gap-2 text-xs text-zinc-500">
              <CreditCard className="w-4 h-4 text-volt" /> PayPal · Visa · Mastercard
            </p>
            <p className="flex items-center gap-2 text-xs text-zinc-500">
              <ShieldCheck className="w-4 h-4 text-volt" /> SSL Secured (256-bit)
            </p>
            <p className="flex items-center gap-2 text-xs text-zinc-500">
              <Truck className="w-4 h-4 text-volt" /> DHL · USPS · Royal Mail
            </p>
          </div>
        </nav>
      </div>

      {/* Wordmark gigante */}
      <div className="relative select-none pointer-events-none" aria-hidden>
        <p className="text-stroke font-display font-black text-center leading-none tracking-tight text-[18vw] lg:text-[13rem] opacity-40 translate-y-[18%]">
          BELLVIION
        </p>
      </div>

      <div className="relative border-t border-white/10 bg-ink-2">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-zinc-600">
            © {new Date().getFullYear()} Bellviion. All rights reserved.
          </p>
          <p className="text-xs text-zinc-700">
            Secure payments powered by PayPal · Free returns within 30 days
          </p>
        </div>
      </div>
    </footer>
  )
}
