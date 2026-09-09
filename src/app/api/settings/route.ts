import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

// GET: configurações públicas
export async function GET() {
  try {
    const settings = await db.setting.findMany()
    const obj: Record<string, string> = {}
    for (const s of settings) obj[s.key] = s.value
    // Nunca expor password nem secret publicamente
    delete obj.admin_password
    delete obj.paypal_client_secret
    return NextResponse.json({ settings: obj })
  } catch (error) {
    console.error("GET /api/settings error:", error)
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
  }
}

// PUT: atualizar settings (admin)
export async function PUT(req: NextRequest) {
  try {
    const password = req.headers.get("x-admin-password")
    const valid = await db.setting.findUnique({ where: { key: "admin_password" } })
    if (!valid || password !== valid.value) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    for (const [key, value] of Object.entries(body)) {
      if (typeof value !== "string") continue
      await db.setting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("PUT /api/settings error:", error)
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
  }
}
