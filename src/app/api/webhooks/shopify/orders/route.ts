import { createHmac, timingSafeEqual } from "node:crypto"
import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

function validSignature(raw: string, signature: string | null) {
  const secret = process.env.SHOPIFY_WEBHOOK_SECRET || process.env.SHOPIFY_API_SECRET
  if (!secret || !signature) return false
  const expected = createHmac("sha256", secret).update(raw, "utf8").digest("base64")
  return expected.length === signature.length && timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
}

export async function POST(request: NextRequest) {
  const raw = await request.text()
  if (!validSignature(raw, request.headers.get("x-shopify-hmac-sha256"))) return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
  try {
    const payload = JSON.parse(raw)
    const shipping = payload.shipping_address || payload.billing_address || {}
    const total = Number(payload.current_total_price || payload.total_price || 0)
    const order = await db.order.upsert({
      where: { shopifyOrderId: String(payload.id) },
      update: { paymentStatus: payload.financial_status === "paid" ? "paid" : "pending", status: payload.fulfillment_status === "fulfilled" ? "shipped" : "processing", trackingNumber: payload.fulfillments?.[0]?.tracking_number || null, trackingUrl: payload.fulfillments?.[0]?.tracking_url || null },
      create: { shopifyOrderId: String(payload.id), orderNumber: String(payload.name || payload.order_number || payload.id), customerName: `${payload.customer?.first_name || shipping.first_name || ""} ${payload.customer?.last_name || shipping.last_name || ""}`.trim() || "Customer", email: payload.email || payload.customer?.email || "", country: shipping.country_code || "US", state: shipping.province_code || shipping.province || null, city: shipping.city || "", address1: shipping.address1 || "", address2: shipping.address2 || null, zipCode: shipping.zip || "", currency: payload.currency || "USD", subtotal: Number(payload.subtotal_price || total), shipping: Number(payload.total_shipping_price_set?.shop_money?.amount || 0), total, paymentStatus: payload.financial_status === "paid" ? "paid" : "pending", status: payload.fulfillment_status === "fulfilled" ? "shipped" : "processing" },
    })
    return NextResponse.json({ success: true, orderId: order.id })
  } catch (error) {
    console.error("Shopify order webhook error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}
