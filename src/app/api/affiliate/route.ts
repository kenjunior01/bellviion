import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

// GET /api/affiliate?code=TIKTOK10 — valida código de afiliado
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const code = searchParams.get("code")
    if (!code) return NextResponse.json({ valid: false })

    const affiliate = await db.affiliate.findUnique({ where: { code: code.toUpperCase() } })
    if (!affiliate || !affiliate.isActive) {
      return NextResponse.json({ valid: false })
    }
    return NextResponse.json({
      valid: true,
      code: affiliate.code,
      commission: affiliate.commission,
    })
  } catch (error) {
    console.error("GET /api/affiliate error:", error)
    return NextResponse.json({ valid: false }, { status: 500 })
  }
}
