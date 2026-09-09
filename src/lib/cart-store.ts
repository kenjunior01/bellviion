"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { CartItem } from "@/lib/store-data"

interface CartState {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.productId === item.productId)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId
                  ? { ...i, quantity: Math.min(99, i.quantity + item.quantity) }
                  : i
              ),
            }
          }
          return { items: [...state.items, item] }
        }),
      removeItem: (productId) =>
        set((state) => ({ items: state.items.filter((i) => i.productId !== productId) })),
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.productId !== productId)
              : state.items.map((i) =>
                  i.productId === productId ? { ...i, quantity: Math.min(99, quantity) } : i
                ),
        })),
      clearCart: () => set({ items: [] }),
    }),
    { name: "bellviion-cart" }
  )
)

// UTM / Referral tracking (persistente)
interface TrackingState {
  referralCode: string | null
  utmSource: string | null
  utmMedium: string | null
  utmCampaign: string | null
  setTracking: (data: Partial<Omit<TrackingState, "setTracking">>) => void
}

export const useTracking = create<TrackingState>()(
  persist(
    (set) => ({
      referralCode: null,
      utmSource: null,
      utmMedium: null,
      utmCampaign: null,
      setTracking: (data) => set(data),
    }),
    { name: "bellviion-tracking" }
  )
)

// Moeda selecionada (persistente)
interface CurrencyState {
  currency: string
  setCurrency: (currency: string) => void
}

export const useCurrency = create<CurrencyState>()(
  persist(
    (set) => ({
      currency: "USD",
      setCurrency: (currency) => set({ currency }),
    }),
    { name: "bellviion-currency" }
  )
)
