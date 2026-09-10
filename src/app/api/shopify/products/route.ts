import { NextResponse } from "next/server"
import { productCatalogQuery, shopifyStorefront, type ShopifyProduct } from "@/lib/shopify-storefront"

export async function GET(request: Request) {
  try {
    const search = new URL(request.url).searchParams.get("q")
    const data = await shopifyStorefront<{ products: { nodes: ShopifyProduct[] } }>(productCatalogQuery, {
      first: 24,
      query: search?.trim() || undefined,
    })
    return NextResponse.json({ products: data.products.nodes })
  } catch (error) {
    console.error("[v0] Shopify catalog error", error)
    return NextResponse.json({ error: "Shopify catalog unavailable" }, { status: 503 })
  }
}
