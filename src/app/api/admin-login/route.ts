import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

// Login do admin — valida password e retorna token simples
export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json()
    const valid = await db.setting.findUnique({ where: { key: "admin_password" } })
    if (!valid || password !== valid.value) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 })
    }
    return NextResponse.json({
      success: true,
      token: Buffer.from(`admin:${password}`).toString("base64"),
    })
  } catch (error) {
    console.error("POST /api/admin-login error:", error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
