const SHOPIFY_API_VERSION = "2026-04"

const endpoint = () => {
  const domain = process.env.SHOPIFY_STORE_DOMAIN
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN
  if (!domain || !token) throw new Error("Shopify storefront integration is not configured")
  return { url: `https://${domain}/api/${SHOPIFY_API_VERSION}/graphql.json`, token }
}

export async function shopifyStorefront<T>(query: string, variables?: Record<string, unknown>) {
  const { url, token } = endpoint()
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Shopify-Storefront-Access-Token": token },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  })
  if (!response.ok) throw new Error(`Shopify request failed: ${response.status}`)
  const payload = (await response.json()) as { data?: T; errors?: Array<{ message: string }> }
  if (payload.errors?.length) throw new Error(payload.errors.map((error) => error.message).join(", "))
  if (!payload.data) throw new Error("Shopify returned no data")
  return payload.data
}

export const productCatalogQuery = `#graphql
  query ProductCatalog($first: Int!, $query: String) {
    products(first: $first, query: $query, sortKey: BEST_SELLING) {
      nodes {
        id
        handle
        title
        description
        featuredImage { url altText width height }
        priceRange { minVariantPrice { amount currencyCode } }
        variants(first: 1) { nodes { id availableForSale } }
      }
    }
  }
`

export const cartCreateMutation = `#graphql
  mutation CreateCart($input: CartInput!) {
    cartCreate(input: $input) {
      cart { id checkoutUrl }
      userErrors { field message }
    }
  }
`

export type ShopifyProduct = {
  id: string
  handle: string
  title: string
  description: string
  featuredImage: { url: string; altText: string | null; width: number; height: number } | null
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } }
  variants: { nodes: Array<{ id: string; availableForSale: boolean }> }
}
