import { db } from "@/lib/db"

const API_VERSION = process.env.SHOPIFY_API_VERSION || "2026-04"

type ShopifyResponse<T> = { data?: T; errors?: Array<{ message: string }> }

export async function getShopifyConnection() {
  return db.shopifyConnection.findFirst({ orderBy: { updatedAt: "desc" } })
}

export async function shopifyAdminQuery<T>(query: string, variables?: Record<string, unknown>) {
  const connection = await getShopifyConnection()
  if (!connection) throw new Error("Shopify is not connected")

  const response = await fetch(`https://${connection.shop}/admin/api/${API_VERSION}/graphql.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": connection.accessToken },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  })
  const payload = (await response.json()) as ShopifyResponse<T>
  if (!response.ok || payload.errors?.length) throw new Error(payload.errors?.map((error) => error.message).join(", ") || "Shopify Admin API request failed")
  return payload.data as T
}

export async function shopifyHealth() {
  try {
    const data = await shopifyAdminQuery<{ shop: { name: string; myshopifyDomain: string } }>("query { shop { name myshopifyDomain } }")
    return { connected: true, shop: data.shop }
  } catch (error) {
    return { connected: false, error: error instanceof Error ? error.message : "Shopify health check failed" }
  }
}

export const SHOPIFY_CATALOG_QUERY = `query Catalog($first: Int!, $after: String) {
  products(first: $first, after: $after) { pageInfo { hasNextPage endCursor } nodes { id title handle status totalInventory variants(first: 50) { nodes { id title price inventoryQuantity } } } }
}`
