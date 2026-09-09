// Seed: Produtos vencedores de dropshipping para mercados de alto valor (US/UK/CA/AU/DE)
import { PrismaClient } from "@prisma/client"

const db = new PrismaClient()

const products = [
  {
    slug: "sunset-projection-lamp",
    name: "Aurora Sunset Projection Lamp",
    tagline: "Transform any room into a golden hour paradise",
    description:
      "The viral TikTok sunset lamp that took over 2024-2025. Project a dreamy sunset, rainbow, or aurora glow across your walls and photos. Perfect for content creators, cozy home aesthetics, and Instagram-worthy backgrounds. 16.5 million views and counting on #sunsetlamp — your customers will keep coming back for more colors. Adjustable 180° head, USB powered, works instantly. This is one of the highest-converting viral home decor products in the US and UK markets.",
    category: "home",
    price: 24.99,
    compareAtPrice: 49.99,
    cost: 6.5,
    image: "/products/sunset-lamp.png",
    badge: "VIRAL",
    isTrending: true,
    soldCount: 12847,
    rating: 4.8,
    reviewCount: 2341,
    keywords: "sunset lamp, viral tiktok lamp, room decor, aesthetic lighting, gift ideas",
  },
  {
    slug: "galaxy-star-projector",
    name: "Nebula Galaxy Star Projector",
    tagline: "Bring the universe into your bedroom",
    description:
      "Turn any ceiling into a breathtaking galaxy. This 3-in-1 projector combines nebula clouds, twinkling stars, and Bluetooth music sync — the #1 selling ambient light in the US market. Massive holiday season seller and perfect for gamers, kids rooms, and romantic setups. Voice control compatible, app controlled, 16 color combinations. Consistently ranks in Amazon top sellers with 40k+ monthly searches for 'galaxy projector'.",
    category: "tech",
    price: 32.99,
    compareAtPrice: 65.99,
    cost: 11.2,
    image: "/products/star-projector.png",
    badge: "BESTSELLER",
    isTrending: true,
    soldCount: 21503,
    rating: 4.9,
    reviewCount: 3812,
    keywords: "galaxy projector, star projector, nebula light, bedroom lights, gaming room setup",
  },
  {
    slug: "3in1-magnetic-wireless-charger",
    name: "MagCharge 3-in-1 Wireless Charging Station",
    tagline: "One dock for your iPhone, AirPods & Watch",
    description:
      "The clean-desk essential every Apple user wants. Foldable magnetic 3-in-1 charging station for iPhone, AirPods and Apple Watch — 15W fast charge, travel-ready folding design. Apple ecosystem accessories are the highest-margin tech dropshipping niche with premium perceived value. Perfect for back-to-school, Black Friday, and Christmas gift guides.",
    category: "tech",
    price: 34.99,
    compareAtPrice: 69.99,
    cost: 12.8,
    image: "/products/wireless-charger.png",
    badge: "TRENDING",
    isTrending: true,
    soldCount: 9432,
    rating: 4.7,
    reviewCount: 1876,
    keywords: "3 in 1 charger, wireless charging station, magsafe charger, apple accessories",
  },
  {
    slug: "ice-roller-face-massager",
    name: "CryoGlow Ice Roller & Face Sculptor",
    tagline: "Depuff, sculpt & glow in 60 seconds",
    description:
      "The beauty tool behind every 'morning routine' video on TikTok. Cryotherapy-inspired ice roller that reduces puffiness, tightens skin, and boosts glow instantly. Beauty & skincare is the #1 dropshipping category for female audiences in the US, UK and Germany — with repeat purchase potential and influencer-friendly content. Pairs perfectly with skincare routines content. Comes in premium rose gold gift packaging.",
    category: "beauty",
    price: 16.99,
    compareAtPrice: 34.99,
    cost: 3.9,
    image: "/products/ice-roller.png",
    badge: "BESTSELLER",
    isTrending: true,
    soldCount: 18206,
    rating: 4.8,
    reviewCount: 4102,
    keywords: "ice roller, face massager, skincare tools, depuff, beauty gifts, tiktok beauty",
  },
  {
    slug: "pet-grooming-glove",
    name: "GentlePet Deshedding Glove",
    tagline: "Your pet will beg for more grooming time",
    description:
      "Pet products never stop selling — pet owners in the US spent $147 billion on their pets in 2024. This 2-in-1 deshedding glove mimics a gentle petting motion while removing loose fur and tangles. Perfect for dogs and cats, machine washable, adjustable wrist strap. Pet niche = loyal customers, repeat buyers, and adorable viral content that markets itself.",
    category: "pets",
    price: 14.99,
    compareAtPrice: 29.99,
    cost: 3.2,
    image: "/products/pet-glove.png",
    badge: "TRENDING",
    isTrending: true,
    soldCount: 27390,
    rating: 4.7,
    reviewCount: 5208,
    keywords: "pet grooming glove, deshedding brush, dog brush, cat grooming, pet hair remover",
  },
  {
    slug: "portable-neck-fan",
    name: "AirChill Bladeless Neck Fan",
    tagline: "Stay cool anywhere — hands-free comfort",
    description:
      "Seasonal winner with explosive summer demand in the US, Australia and Southern Europe. 4000mAh bladeless neck fan with 3 speeds, USB-C rechargeable, whisper-quiet 25dB operation. Wear it at concerts, beach, festivals, sports events, or gardening. Zero shipping issues — lightweight and compact. Perfect impulse buy price point that converts like crazy in heatwave season.",
    category: "tech",
    price: 22.99,
    compareAtPrice: 44.99,
    cost: 7.4,
    image: "/products/neck-fan.png",
    badge: "SUMMER HOT",
    isTrending: false,
    soldCount: 15871,
    rating: 4.6,
    reviewCount: 2894,
    keywords: "neck fan, portable fan, bladeless fan, summer gadgets, cooling fan",
  },
  {
    slug: "cloud-comfort-slippers",
    name: "CloudWalk Ultra-Soft Cloud Slippers",
    tagline: "Walking on clouds — literally",
    description:
      "The pillow-soft slippers with 1.2 billion views on #cloudslippers. Ultra-thick 4.5cm EVA sole, non-slip, waterproof, and cloud-like comfort that customers rave about in reviews. Massive TikTok and Instagram presence with unboxing videos. Unisex sizes, 8 colorways = fewer returns, high satisfaction. Great for the 'cozy season' gifting spike in Q4.",
    category: "fashion",
    price: 21.99,
    compareAtPrice: 42.99,
    cost: 5.6,
    image: "/products/cloud-slippers.png",
    badge: "VIRAL",
    isTrending: true,
    soldCount: 34120,
    rating: 4.8,
    reviewCount: 6745,
    keywords: "cloud slippers, pillow slippers, comfy slides, viral slippers, cozy gifts",
  },
  {
    slug: "fabric-resistance-bands-set",
    name: "SculptFlex Fabric Resistance Bands Set",
    tagline: "Booty-building bands that don't roll up",
    description:
      "Fitness resolutions make January the biggest month, but home workouts sell year-round. Premium non-slip fabric resistance bands (3 levels) that don't pinch or roll like latex. Includes carry bag and workout guide. The fitness niche pairs perfectly with Instagram/TikTok workout content and female audiences in the US, UK and Australia. Lightweight = cheap worldwide shipping.",
    category: "fitness",
    price: 18.99,
    compareAtPrice: 37.99,
    cost: 4.8,
    image: "/products/resistance-bands.png",
    badge: "NEW",
    isTrending: false,
    soldCount: 8917,
    rating: 4.7,
    reviewCount: 1567,
    keywords: "resistance bands, booty bands, home workout, fitness gifts, gym accessories",
  },
  {
    slug: "smart-temperature-water-bottle",
    name: "HydraSmart LED Temperature Bottle",
    tagline: "Know your perfect sip temperature at a glance",
    description:
      "Smart water bottle with LED touch display showing real-time temperature — keeps drinks hot for 12h or cold for 24h with double-wall vacuum insulation. 500ml leak-proof stainless steel. The hydration trend (#waterbottle has 4B+ views) makes this a consistent seller for gym-goers, office workers and students. Excellent upsell potential with bundles.",
    category: "fitness",
    price: 29.99,
    compareAtPrice: 55.99,
    cost: 9.2,
    image: "/products/smart-bottle.png",
    badge: "TRENDING",
    isTrending: true,
    soldCount: 12034,
    rating: 4.8,
    reviewCount: 2245,
    keywords: "smart water bottle, temperature display bottle, insulated bottle, hydration gifts",
  },
  {
    slug: "posture-corrector-pro",
    name: "AlignPro Adjustable Posture Corrector",
    tagline: "Fix tech-neck and stand tall again",
    description:
      "Remote work created a global posture crisis — and a booming market. AlignPro gently pulls shoulders back to relieve neck, shoulder and back pain from desk work and phone use. Breathable neoprene, invisible under clothes, adjustable for chest sizes 28-48'. Health & wellness is a top-3 dropshipping vertical in the US with strong Google Ads search volume for 'posture corrector'.",
    category: "fitness",
    price: 19.99,
    compareAtPrice: 39.99,
    cost: 4.5,
    image: "/products/posture-corrector.png",
    badge: "NEW",
    isTrending: false,
    soldCount: 7621,
    rating: 4.5,
    reviewCount: 1322,
    keywords: "posture corrector, back pain relief, tech neck, desk worker gifts, health gadgets",
  },
]

const reviewsBySlug: Record<string, Array<{ name: string; country: string; rating: number; title: string; content: string }>> = {
  "sunset-projection-lamp": [
    { name: "Jessica M.", country: "US", rating: 5, title: "Obsessed!", content: "Bought it for my daughter's room and now I'm ordering 2 more for myself. The sunset glow is so warm and real — my whole Instagram feed is photos of it now." },
    { name: "Oliver T.", country: "GB", rating: 5, title: "Perfect gift", content: "Ordered this for my girlfriend and she absolutely loves it. Arrived in 9 days to London, well packaged. The quality genuinely surprised me for the price." },
    { name: "Sarah K.", country: "DE", rating: 4, title: "Sehr schön", content: "Beautiful light for cozy evenings. Took a moment to figure out the best angle but once you do, it's magical. Shipping to Germany took 11 days." },
  ],
  "galaxy-star-projector": [
    { name: "Marcus D.", country: "US", rating: 5, title: "My kids won't sleep without it", content: "We use it every night for bedtime stories. The nebula + stars combo is stunning and the remote makes it easy. Best $33 I've spent on Amazon-grade quality." },
    { name: "Emily R.", country: "CA", rating: 5, title: "Gaming room upgrade complete", content: "Pairs perfectly with my setup. The music sync feature is actually responsive. Delivery to Toronto was 8 days." },
    { name: "Liam W.", country: "AU", rating: 4, title: "Great vibe", content: "Really good projector, the Bluetooth speaker is decent too. Wish the app had more scenes but overall very happy." },
  ],
  "3in1-magnetic-wireless-charger": [
    { name: "Daniel P.", country: "US", rating: 5, title: "Desk is finally clean", content: "Charges my iPhone 15 Pro, AirPods Pro and Watch all at once. The magnetic alignment is strong and the foldable design went straight into my travel bag." },
    { name: "Chloe B.", country: "GB", rating: 5, title: "Quality is premium", content: "Was skeptical about ordering a charger online but this feels like Apple store quality. Fast charging works as advertised." },
  ],
  "ice-roller-face-massager": [
    { name: "Ava S.", country: "US", rating: 5, title: "Morning routine essential", content: "I use it every morning after cleansing — the depuffing effect is instant and my makeup goes on smoother. Ordered a second one for my mom." },
    { name: "Mia L.", country: "AU", rating: 5, title: "So refreshing", content: "Perfect for Sydney summers. Keeps it in the fridge and it's the best wake-up call ever. Packaging is gorgeous, very giftable." },
    { name: "Hannah G.", country: "DE", rating: 5, title: "Wunderbar!", content: "My face looks less swollen in the mornings. Shipping was 10 days to Berlin which is totally fine for this price." },
  ],
  "pet-grooming-glove": [
    { name: "Robert H.", country: "US", rating: 5, title: "My cat finally lets me brush him", content: "He runs from every brush but genuinely leans into this glove. So much less fur on the couch. Buying another for my sister's husky." },
    { name: "Natalie F.", country: "CA", rating: 4, title: "Works great on my golden", content: "Removes a shocking amount of loose fur. The fur peels off the glove easily. Would recommend for any shedding breed." },
  ],
  "portable-neck-fan": [
    { name: "Tyler J.", country: "US", rating: 5, title: "Concert lifesaver", content: "Used it at an outdoor festival in 95°F heat — absolute game changer. Barely notice it's on your neck and the battery lasted all day." },
    { name: "Sophie M.", country: "AU", rating: 5, title: "Essential for summer", content: "Wear it gardening every day. Quiet enough to hear the radio. Already ordered a second one for my husband." },
  ],
  "cloud-comfort-slippers": [
    { name: "Amber C.", country: "US", rating: 5, title: "Literally walking on clouds", content: "The sole is so thick and squishy. I have plantar fasciitis and these are the only house shoes that don't hurt. Ordered 3 pairs for family." },
    { name: "Jack N.", country: "GB", rating: 5, title: "Bought a second pair", content: "First pair lasted 8 months of daily wear before I replaced them. Unbeatable for the price. UK delivery took 9 days." },
    { name: "Emma D.", country: "CA", rating: 4, title: "Super comfy", content: "Size guide was accurate. They do squeak slightly on tile floors at first but it goes away. Love the pink." },
  ],
  "fabric-resistance-bands-set": [
    { name: "Madison R.", country: "US", rating: 5, title: "No rolling, no pinching", content: "These fabric bands stay in place through entire workouts, unlike the latex ones. The 3 resistance levels are perfect as I progress." },
    { name: "Olivia P.", country: "AU", rating: 5, title: "Great quality set", content: "Comes in a cute bag with a workout guide. The stitching quality is excellent after 3 months of use 4x a week." },
  ],
  "smart-temperature-water-bottle": [
    { name: "Kevin O.", country: "US", rating: 5, title: "The LED is so satisfying", content: "Tap it and see the exact temperature — my coffee is always perfect now. Ice water stays cold through my entire 12-hour shift." },
    { name: "Grace T.", country: "GB", rating: 5, title: "Stylish and practical", content: "Gets compliments at the office constantly. Doesn't leak in my bag. Worth every penny." },
  ],
  "posture-corrector-pro": [
    { name: "Michael S.", country: "US", rating: 5, title: "My neck pain is gone", content: "WFH destroyed my posture. Two weeks with this and my shoulders are actually back where they should be. Start with 20 min a day." },
    { name: "Laura V.", country: "CA", rating: 4, title: "Effective but takes getting used to", content: "Works as described. The first few days feel strange but your body adjusts quickly. Under clothes it's invisible like they say." },
  ],
}

async function main() {
  console.log("Seeding products without deleting live store data...")
  for (const p of products) {
    const { keywords, category, image, ...rest } = p
    const productCategory = await db.category.findUnique({ where: { name: category } })
    const data = {
      ...rest,
      imageUrl: image,
      categoryId: productCategory?.id ?? null,
      seoTitle: `${p.name} | Bellviion — Free Worldwide Shipping`,
      seoDescription: p.description.slice(0, 155),
      keywords,
      shippingDaysMin: 7,
      shippingDaysMax: 14,
    }
    await db.product.upsert({
      where: { slug: p.slug },
      update: data,
      create: { ...data, stock: 100 + Math.floor(Math.random() * 150) },
    })
  }

  console.log("Seeding reviews...")
  for (const [slug, reviews] of Object.entries(reviewsBySlug)) {
    const product = await db.product.findUnique({ where: { slug } })
    if (!product) continue
    await db.review.deleteMany({ where: { productId: product.id } })
    for (const r of reviews) {
      await db.review.create({
        data: {
          productId: product.id,
          name: r.name,
          country: r.country,
          rating: r.rating,
          title: r.title,
          content: r.content,
          verified: true,
        },
      })
    }
  }

  console.log("Seeding settings...")
  const settings: Record<string, string> = {
    store_name: "Bellviion",
    store_tagline: "Viral Finds. Premium Quality. Worldwide.",
    paypal_client_id: "",
    paypal_mode: "sandbox", // sandbox | live
    admin_password: "bellviion2026",
    free_shipping_threshold: "35",
    flash_sale_end: "",
    announcement: "🔥 FLASH SALE: Up to 50% OFF + FREE Worldwide Shipping — Ends Tonight!",
    affiliate_commission: "10",
  }
  for (const [key, value] of Object.entries(settings)) {
    await db.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    })
  }

  console.log("Seeding demo affiliate...")
  await db.affiliate.upsert({
    where: { code: "TIKTOK10" },
    update: { name: "Demo Influencer", email: "influencer@bellviion.com", commission: 10 },
    create: {
      code: "TIKTOK10",
      name: "Demo Influencer",
      email: "influencer@bellviion.com",
      commission: 10,
    },
  })

  console.log("✅ Seed complete!")
  console.log(`   Products: ${products.length}`)
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect())
