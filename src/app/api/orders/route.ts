import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

// GET: lista pedidos (admin)
export async function GET(req: NextRequest) {
  try {
    const password = req.headers.get("x-admin-password")
    const valid = await db.setting.findUnique({ where: { key: "admin_password" } })
    if (!valid || password !== valid.value) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const orders = await db.order.findMany({
      include: { items: true },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json({ orders })
  } catch (error) {
    console.error("GET /api/orders error:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}

// POST: cria pedido no checkout
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      customerName, email, phone, country, state, city, address1, address2, zipCode,
      currency, exchangeRate, items, referralCode, utmSource, utmMedium, utmCampaign, couponCode,
    } = body

    if (!customerName || !email || !country || !city || !address1 || !zipCode || !items?.length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Recalcula totais no servidor (segurança)
    let subtotalUSD = 0
    const orderItemsData = []
    for (const item of items) {
      const product = await db.product.findUnique({ where: { id: item.productId } })
      if (!product) continue
      const qty = Math.max(1, Math.min(99, parseInt(item.quantity) || 1))
      subtotalUSD += product.price * qty
      orderItemsData.push({
        productId: product.id,
        name: product.name,
        image: product.image,
        unitPrice: product.price,
        quantity: qty,
        variant: item.variant || null,
      })
    }

    if (!orderItemsData.length) {
      return NextResponse.json({ error: "No valid items in order" }, { status: 400 })
    }

    // Frete grátis acima de $35
    const freeThresholdSetting = await db.setting.findUnique({ where: { key: "free_shipping_threshold" } })
    const threshold = freeThresholdSetting ? parseFloat(freeThresholdSetting.value) : 35
    const shipping = subtotalUSD >= threshold ? 0 : 4.99
    const total = subtotalUSD + shipping

    const exchangeRateValue = parseFloat(String(exchangeRate)) || 1
    const orderNumber = "BV-" + Date.now().toString(36).toUpperCase() + Math.floor(Math.random() * 90 + 10)

    const order = await db.order.create({
      data: {
        orderNumber,
        customerName,
        email,
        phone: phone || null,
        country,
        state: state || null,
        city,
        address1,
        address2: address2 || null,
        zipCode,
        currency: currency || "USD",
        exchangeRate: exchangeRateValue,
        subtotal: subtotalUSD,
        shipping,
        total,
        referralCode: referralCode || null,
        utmSource: utmSource || null,
        utmMedium: utmMedium || null,
        utmCampaign: utmCampaign || null,
        couponCode: couponCode || null,
        paymentStatus: "pending",
        status: "processing",
        items: { create: orderItemsData },
      },
      include: { items: true },
    })

    // Atualiza contagem de vendas dos produtos
    for (const item of orderItemsData) {
      if (item.productId) {
        await db.product.update({
          where: { id: item.productId },
          data: { soldCount: { increment: item.quantity } },
        })
      }
    }

    // Registra clique/venda de afiliado
    if (referralCode) {
      const affiliate = await db.affiliate.findUnique({ where: { code: referralCode } })
      if (affiliate) {
        await db.affiliate.update({
          where: { code: referralCode },
          data: { sales: { increment: 1 }, earnings: { increment: total * (affiliate.commission / 100) } },
        })
      }
    }

    return NextResponse.json({ order, paypalAmount: total.toFixed(2) })
  } catch (error) {
    console.error("POST /api/orders error:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
