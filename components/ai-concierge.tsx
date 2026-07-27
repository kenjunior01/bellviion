"use client"

import { useState, useRef, useEffect } from "react"
import { useChat } from "@ai-sdk/react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Send, Sparkles, Loader2, MinusCircle, Maximize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

export function AIConcierge() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/concierge",
    initialMessages: [
      {
        id: "welcome",
        role: "assistant",
        content:
          "Bem-vindo à BELLVION. Eu sou o seu Concierge Digital especializado em luxo contemporâneo. Posso ajudá-lo a descobrir a peça perfeita, pesquisar tendências de moda e estilo, ou simplesmente conversar sobre excelência e exclusividade. Como posso tornar a sua experiência mais memorável?",
      },
    ],
  })

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="w-16 h-16 bg-gold rounded-full shadow-2xl flex items-center justify-center text-black hover:bg-white transition-colors duration-500 group border-2 border-gold"
          >
            <Sparkles className="w-8 h-8 group-hover:scale-110 transition-transform duration-500" />
            <span className="absolute -top-2 -right-2 bg-black text-gold text-[10px] px-2 py-1 rounded-full border border-gold font-bold">
              AI
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: 100, opacity: 0, scale: 0.9 }}
            animate={{
              y: 0,
              opacity: 1,
              scale: 1,
              height: isMinimized ? "auto" : "600px",
            }}
            exit={{ y: 100, opacity: 0, scale: 0.9 }}
            className="w-[400px] bg-black border border-gold/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-gold/20 flex items-center justify-between bg-gradient-to-r from-black to-zinc-900">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/50 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white tracking-widest uppercase">CONCIERGE</h3>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] text-gray-400 uppercase tracking-tighter">Online agora</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-2 text-gray-500 hover:text-gold transition-colors"
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <MinusCircle className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-gray-500 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <ScrollArea className="flex-1 p-4 bg-zinc-950/50" ref={scrollRef}>
                  <div className="space-y-4 pb-4">
                    {messages.map((m) => (
                      <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                            m.role === "user"
                              ? "bg-gold text-black rounded-tr-none font-medium"
                              : "bg-zinc-900 text-gray-200 border border-gold/10 rounded-tl-none font-light"
                          }`}
                        >
                          {m.content}
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-zinc-900 border border-gold/10 p-3 rounded-2xl rounded-tl-none">
                          <Loader2 className="w-4 h-4 text-gold animate-spin" />
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                {/* Footer */}
                <div className="p-4 border-t border-gold/20 bg-black">
                  <form onSubmit={handleSubmit} className="relative">
                    <Input
                      value={input}
                      onChange={handleInputChange}
                      placeholder="Diga algo ao concierge..."
                      className="bg-zinc-900 border-gold/20 focus-visible:ring-gold text-white pr-12 h-12 rounded-xl placeholder:text-gray-600 placeholder:italic font-light"
                    />
                    <Button
                      type="submit"
                      disabled={isLoading || !input.trim()}
                      size="icon"
                      className="absolute right-1.5 top-1.5 bg-gold hover:bg-white text-black h-9 w-9 rounded-lg transition-colors duration-300"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </form>
                  <div className="mt-3 pt-2 border-t border-gold/20">
                    <p className="text-[9px] text-center text-gray-600 uppercase tracking-widest font-medium">
                      BELLVION — Autêntico, Raro, Memorável
                    </p>
                    <p className="text-[8px] text-center text-gray-700 mt-1 italic">
                      Seu assistente de estilo de luxo
                    </p>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
