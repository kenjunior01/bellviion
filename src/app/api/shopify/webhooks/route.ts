import { NextRequest, NextResponse } from "next/server"
import { UserRole } from "@prisma/client"
import { requireRole } from "@/lib/auth"
import { shopifyAdminQuery } from "@/lib/shopify-admin"

const WEBHOOK_CREATE = `mutation WebhookCreate($topic: WebhookSubscriptionTopic!, $callbackUrl: URL!) {
  webhookSubscriptionCreate(topic: $topic, webhookSubscription: { callbackUrl: $callbackUrl, format: JSON }) {
    webhookSubscription { id topic endpoint { __typename ... on WebhookHttpEndpoint { callbackUrl } } }
    userErrors { field message }
  }
}`

type WebhookResult = { webhookSubscriptionCreate: { webhookSubscription: { id: string; topic: string } | null; userErrors: Array<{ message: string }> } }

export async function POST(request: NextRequest) {
  const user = await requireRole([UserRole.ADMIN, UserRole.OPERATOR])
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const origin = request.headers.get("origin") || process.env.BETTER_AUTH_URL || ""
  if (!origin) return NextResponse.json({ error: "Public app URL is required" }, { status: 400 })
  const callbacks = [
    ["ORDERS_CREATE", "/api/webhooks/shopify/orders"],
    ["ORDERS_UPDATED", "/api/webhooks/shopify/orders"],
    ["PRODUCTS_UPDATE", "/api/webhooks/shopify/products"],
    ["INVENTORY_LEVELS_UPDATE", "/api/webhooks/shopify/products"],
  ] as const
  const results = []
  for (const [topic, path] of callbacks) {
    const result = await shopifyAdminQuery<WebhookResult>(WEBHOOK_CREATE, { topic, callbackUrl: `${origin}${path}` })
    if (result.webhookSubscriptionCreate.userErrors.length) return NextResponse.json({ error: result.webhookSubscriptionCreate.userErrors.map((error) => error.message).join(", "), topic }, { status: 422 })
    results.push(result.webhookSubscriptionCreate.webhookSubscription)
  }
  return NextResponse.json({ success: true, webhooks: results })
}
