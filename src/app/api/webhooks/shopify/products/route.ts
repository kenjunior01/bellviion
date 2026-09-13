import { createHmac, timingSafeEqual } from "node:crypto"
import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

function validSignature(raw: string, signature: string | null) {
  const secret = process.env.SHOPIFY_WEBHOOK_SECRET || process.env.SHOPIFY_SHARED_SECRET_2 || process.env.SHOPIFY_SHARED_SECRET || process.env.SHOPIFY_API_SECRET
  if (!secret || !signature) return false
  const expected = createHmac("sha256", secret).update(raw).digest("base64")
  return expected.length === signature.length && timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
}

export async function POST(request: NextRequest) {
  const raw = await request.text()
  if (!validSignature(raw, request.headers.get("x-shopify-hmac-sha256"))) return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
  const eventId = request.headers.get("x-shopify-webhook-id")
  if (eventId && await db.shopifyWebhookEvent.findUnique({ where: { eventId } })) return NextResponse.json({ success: true, duplicate: true })
  try {
    const payload = JSON.parse(raw)
    if (eventId) await db.shopifyWebhookEvent.create({ data: { eventId, shop: request.headers.get("x-shopify-shop-domain") || "unknown", topic: request.headers.get("x-shopify-topic") || "products/update" } })
    if (payload.handle) await db.product.updateMany({ where: { slug: payload.handle }, data: { name: payload.title, description: payload.body_html || null, stock: Array.isArray(payload.variants) ? payload.variants.reduce((total: number, variant: { inventory_quantity?: number }) => total + Number(variant.inventory_quantity || 0), 0) : undefined, imageUrl: payload.image?.src || null, isActive: payload.status === "active" } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Product webhook failed" }, { status: 500 })
  }
}
