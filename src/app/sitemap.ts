import type { MetadataRoute } from "next"
import { db } from "@/lib/db"

// Sitemap dinâmico — inclui todos os produtos ativos (bom para Google Shopping / SEO)
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://www.bellviion.com"

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
  ]

  let productRoutes: MetadataRoute.Sitemap = []
  try {
    const products = await db.product.findMany({ where: { isActive: true } })
    productRoutes = products.map((p) => ({
      url: `${base}/?product=${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }))
  } catch {
    // DB indisponível no build — mantém rotas estáticas
  }

  return [...staticRoutes, ...productRoutes]
}
