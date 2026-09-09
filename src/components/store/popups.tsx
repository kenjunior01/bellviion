"use client"

import { useState, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { X, Mail } from "lucide-react"
import { toast } from "sonner"
import { randomProof } from "./shared"

// ============================================================
// Toast de prova social (compras recentes)
// ============================================================
export function SocialProofPopup() {
  const [visible, setVisible] = useState(false)
  const [proof, setProof] = useState<{ location: string; product: string }>({ location: "", product: "" })

  useEffect(() => {
    let showTimer: ReturnType<typeof setTimeout>
    let hideTimer: ReturnType<typeof setTimeout>

    const cycle = () => {
      showTimer = setTimeout(() => {
        setProof(randomProof())
        setVisible(true)
        hideTimer = setTimeout(() => {
          setVisible(false)
          cycle()
        }, 5000)
      }, 12000)
    }
    cycle()
    return () => { clearTimeout(showTimer); clearTimeout(hideTimer) }
  }, [])

  const flag = proof.location.split(", ")[1] || ""
  const flagEmoji: Record<string, string> = {
    US: "🇺🇸", GB: "🇬🇧", CA: "🇨🇦", AU: "🇦🇺", DE: "🇩🇪", FR: "🇫🇷", IE: "🇮🇪", NZ: "🇳🇿", NL: "🇳🇱", CH: "🇨🇭",
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -60 }}
          className="fixed bottom-4 left-4 z-40 glass-strong rounded-2xl shadow-2xl shadow-black/50 p-3.5 pr-8 max-w-xs border-volt/20"
          role="status"
        >
          <button onClick={() => setVisible(false)} className="absolute top-2 right-2 text-zinc-600 hover:text-zinc-300" aria-label="Dismiss">
            <X className="w-3.5 h-3.5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-volt flex items-center justify-center text-zinc-950 text-lg shrink-0">
              🛒
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">{proof.product}</p>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                {flagEmoji[flag] || "🌍"} Someone in {proof.location} · <span className="text-volt font-bold">just bought</span>
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ============================================================
// Popup newsletter (10% off) — aparece após 15s
// ============================================================
export function NewsletterPopup() {
  const [visible, setVisible] = useState(false)
  const [email, setEmail] = useState("")
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem("bv_newsletter_seen")) return
    const t = setTimeout(() => setVisible(true), 15000)
    return () => clearTimeout(t)
  }, [])

  const close = () => {
    setVisible(false)
    sessionStorage.setItem("bv_newsletter_seen", "1")
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    const res = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, source: "popup" }),
    })
    if (res.ok) {
      setDone(true)
      toast.success("🎉 Code WELCOME10 unlocked! Apply at checkout.")
      setTimeout(close, 2500)
    } else {
      toast.error("Please enter a valid email")
    }
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[55] bg-ink/80 backdrop-blur-md flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Newsletter signup"
        >
          <motion.div
            initial={{ scale: 0.9, y: 24 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 24 }}
            className="relative glass-strong rounded-[2rem] max-w-md w-full p-8 shadow-2xl shadow-black/60 noise overflow-hidden"
          >
            <div className="absolute -top-20 -right-20 w-64 h-64 aurora-volt" aria-hidden />
            <button onClick={close} className="absolute top-4 right-4 text-zinc-500 hover:text-white z-10" aria-label="Close">
              <X className="w-5 h-5" />
            </button>

            {done ? (
              <div className="text-center py-6 relative">
                <span className="text-5xl">🎉</span>
                <h2 className="text-3xl font-black font-display uppercase tracking-tight text-white mt-4">You&apos;re in!</h2>
                <p className="text-sm text-zinc-400 mt-3">
                  Use code <span className="font-black text-volt bg-volt/10 border border-volt/30 px-2 py-0.5 rounded">WELCOME10</span> for 10% off your first order.
                </p>
              </div>
            ) : (
              <div className="relative">
                <div className="text-center">
                  <span className="text-5xl">🎁</span>
                  <h2 className="text-3xl font-black font-display uppercase tracking-tight text-white mt-4">
                    Wait! Get <span className="text-gradient-volt">10% OFF</span>
                  </h2>
                  <p className="text-sm text-zinc-400 mt-3">
                    Join 80,000+ deal hunters and receive an exclusive 10% discount code for your first order.
                  </p>
                </div>
                <form onSubmit={submit} className="mt-7 space-y-3">
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full pl-11 pr-4 py-3.5 text-sm bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-zinc-500 outline-none focus:border-volt/50 focus:ring-2 focus:ring-volt/20 transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-volt text-zinc-950 font-black font-display uppercase tracking-wide py-4 rounded-2xl glow-volt hover:scale-[1.01] active:scale-95 transition-transform"
                  >
                    Get My 10% Off Code
                  </button>
                  <button type="button" onClick={close} className="w-full text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
                    No thanks, I like paying full price
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
