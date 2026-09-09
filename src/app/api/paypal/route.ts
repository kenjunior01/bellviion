import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

const PAYPAL_BASE = {
  sandbox: "https://api-m.sandbox.paypal.com",
  live: "https://api-m.paypal.com",
}

async function getPaypalAccessToken(clientId: string, clientSecret: string, mode: string) {
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64")
  const res = await fetch(`${PAYPAL_BASE[mode as "sandbox" | "live"]}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  })
  const data = await res.json()
  if (!data.access_token) throw new Error("PayPal auth failed")
  return data.access_token
}

// POST /api/paypal  { action: "create" | "capture" | "status" }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { action } = body

    // Retorna status da configuração PayPal
    if (action === "status") {
      const clientIdSetting = await db.setting.findUnique({ where: { key: "paypal_client_id" } })
      const modeSetting = await db.setting.findUnique({ where: { key: "paypal_mode" } })
      const clientId = clientIdSetting?.value || ""
      return NextResponse.json({
        configured: !!clientId,
        clientId,
        mode: modeSetting?.value || "sandbox",
      })
    }

    const clientIdSetting = await db.setting.findUnique({ where: { key: "paypal_client_id" } })
    const modeSetting = await db.setting.findUnique({ where: { key: "paypal_mode" } })
    const clientId = clientIdSetting?.value || ""
    const mode = modeSetting?.value || "sandbox"

    // MODO DEMO: sem credenciais PayPal configuradas → simula pagamento com sucesso
    if (!clientId) {
      if (action === "capture") {
        const { orderId, localOrderId } = body
        if (localOrderId) {
          await db.order.update({
            where: { id: localOrderId },
            data: {
              paymentStatus: "paid",
              paypalOrderId: `DEMO-${Date.now()}`,
              paypalCaptureId: `DEMO-CAP-${Date.now()}`,
            },
          })
        }
        return NextResponse.json({
          demo: true,
          captured: true,
          message: "Demo mode: payment simulated successfully. Configure PayPal credentials in Admin to accept real payments.",
        })
      }
      return NextResponse.json({ demo: true, message: "PayPal demo mode active" })
    }

    // MODO REAL: credenciais configuradas
    const clientSecretSetting = await db.setting.findUnique({ where: { key: "paypal_client_secret" } })
    const clientSecret = clientSecretSetting?.value || ""

    if (action === "create") {
      const { amount, currency, orderNumber } = body
      const accessToken = await getPaypalAccessToken(clientId, clientSecret, mode)
      const res = await fetch(`${PAYPAL_BASE[mode as "sandbox" | "live"]}/v2/checkout/orders`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          intent: "CAPTURE",
          purchase_units: [
            {
              reference_id: orderNumber || "BELLVIION",
              amount: { currency_code: currency || "USD", value: amount },
            },
          ],
        }),
      })
      const data = await res.json()
      return NextResponse.json(data)
    }

    if (action === "capture") {
      const { paypalOrderId, localOrderId } = body
      const accessToken = await getPaypalAccessToken(clientId, clientSecret, mode)
      const res = await fetch(
        `${PAYPAL_BASE[mode as "sandbox" | "live"]}/v2/checkout/orders/${paypalOrderId}/capture`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      )
      const data = await res.json()

      if (data.status === "COMPLETED" && localOrderId) {
        const captureId = data.purchase_units?.[0]?.payments?.captures?.[0]?.id
        await db.order.update({
          where: { id: localOrderId },
          data: { paymentStatus: "paid", paypalOrderId, paypalCaptureId: captureId },
        })
      }
      return NextResponse.json(data)
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("POST /api/paypal error:", error)
    return NextResponse.json({ error: "PayPal operation failed" }, { status: 500 })
  }
}
