import { NextRequest, NextResponse } from "next/server"
import { UserRole } from "@prisma/client"
import { requireRole } from "@/lib/auth"
import { db } from "@/lib/db"
import { shopifyAdminQuery } from "@/lib/shopify-admin"

const CATALOG_QUERY = `query Catalog($first: Int!, $after: String) {
  products(first: $first, after: $after) { pageInfo { hasNextPage endCursor } nodes { id title handle descriptionHtml totalInventory status featuredImage { url } variants(first: 50) { nodes { id title price inventoryQuantity } } } }
}`

type CatalogData = { products: { pageInfo: { hasNextPage: boolean; endCursor: string | null }; nodes: Array<{ id: string; title: string; handle: string; descriptionHtml: string; totalInventory: number; status: string; featuredImage?: { url: string } | null; variants: { nodes: Array<{ id: string; title: string; price: string; inventoryQuantity: number }> } }> } }

export async function POST(request: NextRequest) {
  const user = await requireRole([UserRole.ADMIN, UserRole.OPERATOR])
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  try {
    let after: string | null = null
    let synced = 0
    do {
      const data = await shopifyAdminQuery<CatalogData>(CATALOG_QUERY, { first: 50, after })
      for (const product of data.products.nodes) {
        const variant = product.variants.nodes[0]
        if (!variant) continue
        await db.product.upsert({
          where: { slug: product.handle },
          create: { slug: product.handle, name: product.title, description: product.descriptionHtml, price: Number(variant.price), imageUrl: product.featuredImage?.url || null, stock: product.totalInventory, isActive: product.status === "ACTIVE" },
          update: { name: product.title, description: product.descriptionHtml, price: Number(variant.price), imageUrl: product.featuredImage?.url || null, stock: product.totalInventory, isActive: product.status === "ACTIVE" },
        })
        synced += 1
      }
      after = data.products.pageInfo.hasNextPage ? data.products.pageInfo.endCursor : null
    } while (after)
    await db.shopifyConnection.updateMany({ data: { lastSyncAt: new Date() } })
    return NextResponse.json({ success: true, synced })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Shopify sync failed" }, { status: 502 })
  }
}
