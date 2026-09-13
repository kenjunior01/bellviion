import { createHmac, randomUUID, timingSafeEqual } from "node:crypto"
import { NextRequest, NextResponse } from "next/server"

function verifyShopifyHmac(params: URLSearchParams, secret: string) {
  const received = params.get("hmac")
  if (!received) return false

  const message = [...params.entries()]
    .filter(([key]) => key !== "hmac" && key !== "signature")
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("&")
  const expected = createHmac("sha256", secret).update(message).digest("hex")
  const receivedBuffer = Buffer.from(received, "utf8")
  const expectedBuffer = Buffer.from(expected, "utf8")
  return receivedBuffer.length === expectedBuffer.length && timingSafeEqual(receivedBuffer, expectedBuffer)
}

function validShopDomain(shop: string) {
  return /^[a-z0-9][a-z0-9-]*\.myshopify\.com$/i.test(shop)
}

export async function GET(request: NextRequest) {
  const incoming = new URL(request.url)
  const shop = incoming.searchParams.get("shop")
  const secret = process.env.SHOPIFY_SHARED_SECRET_2 || process.env.SHOPIFY_SHARED_SECRET || process.env.SHOPIFY_API_SECRET
  const clientId = process.env.SHOPIFY_CLIENT_ID || process.env.SHOPIFY_API_KEY
  const forwardedHost = request.headers.get("x-forwarded-host")
  const forwardedProto = request.headers.get("x-forwarded-proto") || "https"
  const publicOrigin = forwardedHost ? `${forwardedProto}://${forwardedHost}` : incoming.origin
  const redirectUri = `${publicOrigin}/api/shopify/oauth`

  if (!shop || !validShopDomain(shop)) {
    return NextResponse.json({ error: "Invalid Shopify shop domain" }, { status: 400 })
  }
  if (!secret) {
    return NextResponse.json({ error: "Shopify OAuth secret is not configured" }, { status: 503 })
  }
  if (!verifyShopifyHmac(incoming.searchParams, secret)) {
    return NextResponse.json(
      { error: "Shopify HMAC verification failed", detail: "Check that SHOPIFY_SHARED_SECRET_2 matches the Client Secret for the Shopify app that generated this installation URL." },
      { status: 401 },
    )
  }

  const code = incoming.searchParams.get("code")
  if (!code) {
    if (!clientId) {
      return NextResponse.json(
        { error: "Shopify OAuth is not configured", detail: "Set SHOPIFY_CLIENT_ID in the Vercel project." },
        { status: 503 },
      )
    }

    const scopes = [
      "read_products",
      "write_products",
      "read_inventory",
      "write_inventory",
      "read_orders",
      "write_orders",
      "read_fulfillments",
      "write_fulfillments",
    ].join(",")
    const authorize = new URL(`https://${shop}/admin/oauth/authorize`)
    authorize.searchParams.set("client_id", clientId)
    authorize.searchParams.set("scope", scopes)
    authorize.searchParams.set("redirect_uri", redirectUri)
    authorize.searchParams.set("state", randomUUID())
    return NextResponse.redirect(authorize)
  }

  const tokenResponse = await fetch(`https://${shop}/admin/oauth/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ client_id: clientId, client_secret: secret, code }),
    cache: "no-store",
  })

  if (!tokenResponse.ok) {
    return NextResponse.json({ error: "Shopify authorization failed" }, { status: 502 })
  }

  const tokenPayload = (await tokenResponse.json()) as { access_token?: string; scope?: string }
  if (!tokenPayload.access_token) {
    return NextResponse.json({ error: "Shopify did not return an access token" }, { status: 502 })
  }

  return NextResponse.json({
    connected: true,
    shop,
    scope: tokenPayload.scope,
    message: "Shopify connected. Store the Admin API token in a secure server-side integration.",
  })
}
