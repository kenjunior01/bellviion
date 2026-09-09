// ============================================================
// Bellviion — Tipos, moedas e utilitários
// ============================================================

export interface Product {
  id: string
  slug: string
  name: string
  tagline: string | null
  description: string
  category: string
  price: number
  compareAtPrice: number | null
  cost: number | null
  image: string
  stock: number
  rating: number
  reviewCount: number
  soldCount: number
  badge: string | null
  isTrending: boolean
  isActive: boolean
  seoTitle: string | null
  seoDescription: string | null
  keywords: string | null
  shippingDaysMin: number
  shippingDaysMax: number
  createdAt: string
}

export interface Review {
  id: string
  productId: string
  name: string
  country: string
  rating: number
  title: string | null
  content: string
  verified: boolean
  createdAt: string
}

export interface CartItem {
  productId: string
  name: string
  image: string
  price: number
  quantity: number
}

export interface Order {
  id: string
  orderNumber: string
  customerName: string
  email: string
  country: string
  city: string
  zipCode?: string
  currency: string
  subtotal: number
  shipping: number
  total: number
  paymentStatus: string
  status: string
  createdAt: string
  items: OrderItem[]
  referralCode?: string | null
  utmSource?: string | null
  utmMedium?: string | null
  utmCampaign?: string | null
}

export interface OrderItem {
  id: string
  productId: string | null
  name: string
  image: string | null
  unitPrice: number
  quantity: number
}

// ============================================================
// MOEDAS — mercados de alto valor (preço base em USD)
// ============================================================
export const CURRENCIES: Record<
  string,
  { symbol: string; rate: number; label: string; flag: string; locale: string }
> = {
  USD: { symbol: "$", rate: 1, label: "US Dollar", flag: "🇺🇸", locale: "en-US" },
  EUR: { symbol: "€", rate: 0.92, label: "Euro", flag: "🇪🇺", locale: "de-DE" },
  GBP: { symbol: "£", rate: 0.79, label: "British Pound", flag: "🇬🇧", locale: "en-GB" },
  CAD: { symbol: "C$", rate: 1.36, label: "Canadian Dollar", flag: "🇨🇦", locale: "en-CA" },
  AUD: { symbol: "A$", rate: 1.52, label: "Australian Dollar", flag: "🇦🇺", locale: "en-AU" },
}

export function formatPrice(usd: number, currency: string): string {
  const c = CURRENCIES[currency] || CURRENCIES.USD
  const converted = usd * c.rate
  return `${c.symbol}${converted.toFixed(2)}`
}

// Países prioritários (maior poder de compra + PayPal)
export const TOP_COUNTRIES = [
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "AU", name: "Australia", flag: "🇦🇺" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "NL", name: "Netherlands", flag: "🇳🇱" },
  { code: "SE", name: "Sweden", flag: "🇸🇪" },
  { code: "NO", name: "Norway", flag: "🇳🇴" },
  { code: "CH", name: "Switzerland", flag: "🇨🇭" },
  { code: "AT", name: "Austria", flag: "🇦🇹" },
  { code: "IE", name: "Ireland", flag: "🇮🇪" },
  { code: "NZ", name: "New Zealand", flag: "🇳🇿" },
  { code: "BE", name: "Belgium", flag: "🇧🇪" },
  { code: "DK", name: "Denmark", flag: "🇩🇰" },
  { code: "FI", name: "Finland", flag: "🇫🇮" },
  { code: "ES", name: "Spain", flag: "🇪🇸" },
  { code: "IT", name: "Italy", flag: "🇮🇹" },
  { code: "PT", name: "Portugal", flag: "🇵🇹" },
  { code: "AE", name: "United Arab Emirates", flag: "🇦🇪" },
  { code: "SA", name: "Saudi Arabia", flag: "🇸🇦" },
  { code: "JP", name: "Japan", flag: "🇯🇵" },
  { code: "KR", name: "South Korea", flag: "🇰🇷" },
  { code: "SG", name: "Singapore", flag: "🇸🇬" },
  { code: "MX", name: "Mexico", flag: "🇲🇽" },
  { code: "BR", name: "Brazil", flag: "🇧🇷" },
  { code: "ZA", name: "South Africa", flag: "🇿🇦" },
  { code: "MZ", name: "Mozambique", flag: "🇲🇿" },
  { code: "AO", name: "Angola", flag: "🇦🇴" },
  { code: "Other", name: "Other Country", flag: "🌍" },
]

export const COUNTRY_FLAGS: Record<string, string> = Object.fromEntries(
  TOP_COUNTRIES.map((c) => [c.code, c.flag])
)

export const CATEGORIES = [
  { id: "all", label: "All Products", icon: "🛍️" },
  { id: "tech", label: "Tech & Gadgets", icon: "📱" },
  { id: "home", label: "Home & Living", icon: "🏠" },
  { id: "beauty", label: "Beauty & Care", icon: "💄" },
  { id: "fitness", label: "Fitness", icon: "💪" },
  { id: "pets", label: "Pet Lovers", icon: "🐾" },
  { id: "fashion", label: "Fashion", icon: "👟" },
]

// CIDADES para o popup de prova social
export const SOCIAL_PROOF_LOCATIONS = [
  "New York, US", "London, GB", "Los Angeles, US", "Toronto, CA", "Sydney, AU",
  "Berlin, DE", "Chicago, US", "Manchester, GB", "Paris, FR", "Melbourne, AU",
  "Vancouver, CA", "Munich, DE", "Austin, US", "Dublin, IE", "Auckland, NZ",
  "Amsterdam, NL", "Seattle, US", "Birmingham, GB", "Calgary, CA", "Zurich, CH",
]

export function discountPercent(price: number, compareAt: number | null): number {
  if (!compareAt || compareAt <= price) return 0
  return Math.round(((compareAt - price) / compareAt) * 100)
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric",
  })
}
