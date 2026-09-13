import { NextRequest, NextResponse } from "next/server"
import { UserRole } from "@prisma/client"
import { requireRole } from "@/lib/auth"
import { shopifyAdminQuery, SHOPIFY_CATALOG_QUERY } from "@/lib/shopify-admin"

export async function GET(request: NextRequest) {
  const user = await requireRole([UserRole.ADMIN, UserRole.OPERATOR])
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  try {
    const data = await shopifyAdminQuery(SHOPIFY_CATALOG_QUERY, { first: 50, after: null })
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Shopify catalog sync failed" }, { status: 502 })
  }
}
