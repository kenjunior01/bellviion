# BELLVIION — Viral Dropshipping Store v2.0

Bellviion is a production-ready viral dropshipping store built for high-value markets (🇺🇸 US · 🇬🇧 UK · 🇨🇦 CA · 🇦🇺 AU · 🇪🇺 EU) with PayPal checkout, an affiliate/referral tracking system and a complete SEO strategy baked in.

Built with **Next.js 16 · TypeScript · Tailwind CSS · shadcn/ui · Prisma (SQLite) · Framer Motion**.

## ✨ What's inside

**Viral & conversion engine**
- Flash sale countdown (persistent), live viewers counter, stock urgency bars
- Social-proof popups (recent purchases), newsletter popup (10% off)
- Badges: VIRAL / BESTSELLER / TRENDING, sold counts, anchor pricing with % off
- Free-shipping progress bar, kinetic hero, marquee — "VOLT" design system (dark premium + electric lime)

**Money**
- PayPal checkout — server-side OAuth (create/capture/status). Works in demo mode without credentials; switch to live in Admin → Settings or `.env`
- Multi-currency: USD / EUR / GBP / CAD / AUD with persistent selector
- Affiliate system: `?ref=CODE&utm_source=...` tracked end-to-end (clicks → orders → commission)

**Admin dashboard** (`/admin`, password-protected)
- Revenue + margin overview, orders with affiliate/UTM attribution
- Full product CRUD (incl. private `cost` field for margin calc, SEO keywords)
- Toggle visible/trending, settings for PayPal, announcement bar, free shipping, commission %

**SEO**
- Full metadata + OpenGraph + Twitter cards, JSON-LD (`OnlineStore`, `WebSite`, `Product`)
- Dynamic `sitemap.xml`, `robots.txt`, semantic HTML, image alt texts, keyword targeting for US/UK/CA/AU

## 🚀 Getting started

```bash
# 1. Install
npm install   # or: bun install

# 2. Environment
cp .env.example .env

# 3. Database (SQLite — no server needed)
npx prisma db push
npx tsx prisma/seed.ts   # optional: 10 winning products demo data

# 4. Run
npm run dev      # http://localhost:3000
```

## 🔑 Admin access

1. Go to `/admin`
2. Default password: `bellviion2026`
3. **Change it immediately** in Settings

In Admin you can add the best-selling products for each target country, set stock, margins, SEO keywords, trending flags and more.

## 💳 PayPal

1. Create an app at [developer.paypal.com](https://developer.paypal.com/dashboard/applications)
2. Copy Client ID + Secret into **Admin → Settings** (or `.env` as `PAYPAL_CLIENT_ID` / `PAYPAL_CLIENT_SECRET`)
3. Set mode to `live` when going to production

Without credentials the checkout runs in demo mode (orders are created and marked paid for testing).

## 📦 Sourcing (dropshipping)

Recommended suppliers: AliExpress · CJ Dropshipping · Zendrop · Spocket.
Research winning products with TikTok Creative Center, Facebook Ad Library and AliExpress Dropshipping Center.

## 🌐 Deploy

Works on any Node host (Vercel, Railway, VPS). For a database on serverless hosts, swap the SQLite provider in `prisma/schema.prisma` for Postgres and update `DATABASE_URL`.
