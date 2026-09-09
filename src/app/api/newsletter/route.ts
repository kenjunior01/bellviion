import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, source } = body
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 })
    }
    await db.subscriber.upsert({
      where: { email },
      update: {},
      create: { email, source: source || "footer" },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("POST /api/newsletter error:", error)
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 })
  }
}
