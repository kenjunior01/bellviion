import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

// Tracking de eventos: referral, product_view, add_to_cart, share
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { type, productId, referralCode, utmSource, utmMedium, utmCampaign, country } = body

    await db.clickEvent.create({
      data: {
        type: type || "product_view",
        productId: productId || null,
        referralCode: referralCode || null,
        utmSource: utmSource || null,
        utmMedium: utmMedium || null,
        utmCampaign: utmCampaign || null,
        country: country || null,
        userAgent: req.headers.get("user-agent") || "",
      },
    })

    // Incrementa clicks do afiliado
    if (type === "referral" && referralCode) {
      await db.affiliate.updateMany({
        where: { code: referralCode },
        data: { clicks: { increment: 1 } },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("POST /api/track error:", error)
    return NextResponse.json({ error: "Failed to track" }, { status: 500 })
  }
}
