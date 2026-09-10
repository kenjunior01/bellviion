import { NextResponse } from "next/server"
import { cartCreateMutation, shopifyStorefront } from "@/lib/shopify-storefront"

const isValidLine = (line: unknown): line is { merchandiseId: string; quantity: number } => {
  if (!line || typeof line !== "object") return false
  const item = line as Record<string, unknown>
  return typeof item.merchandiseId === "string" && /^gid:\/\/shopify\/ProductVariant\//.test(item.merchandiseId) && Number.isInteger(item.quantity) && item.quantity > 0 && item.quantity <= 20
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const lines = Array.isArray(body.lines) ? body.lines.filter(isValidLine).slice(0, 50) : []
    if (!lines.length) return NextResponse.json({ error: "At least one valid product variant is required" }, { status: 400 })
    const data = await shopifyStorefront<{ cartCreate: { cart: { id: string; checkoutUrl: string } | null; userErrors: Array<{ message: string }> } }>(cartCreateMutation, { input: { lines } })
    if (data.cartCreate.userErrors.length || !data.cartCreate.cart) return NextResponse.json({ error: data.cartCreate.userErrors.map((item) => item.message).join(", ") || "Unable to create cart" }, { status: 422 })
    return NextResponse.json(data.cartCreate.cart)
  } catch (error) {
    console.error("[v0] Shopify cart error", error)
    return NextResponse.json({ error: "Shopify checkout unavailable" }, { status: 503 })
  }
}
