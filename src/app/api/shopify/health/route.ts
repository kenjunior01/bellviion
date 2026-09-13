import { NextRequest, NextResponse } from "next/server"
import { requireRole } from "@/lib/auth"
import { UserRole } from "@prisma/client"
import { shopifyHealth } from "@/lib/shopify-admin"

export async function GET(request: NextRequest) {
  const user = await requireRole([UserRole.ADMIN, UserRole.OPERATOR])
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  return NextResponse.json(await shopifyHealth())
}
