import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

async function checkAdmin(req: NextRequest) {
  const password = req.headers.get("x-admin-password")
  const valid = await db.setting.findUnique({ where: { key: "admin_password" } })
  return valid && password === valid.value
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const product = await db.product.findUnique({
      where: { id },
      include: { category: true },
    })
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 })
    const reviews = await db.review.findMany({
      where: { productId: id },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json({
      product: {
        ...product,
        image: product.imageUrl,
        category: product.category?.name ?? null,
        price: Number(product.price),
        compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
        reviews,
      },
    })
  } catch (error) {
    console.error("GET /api/products/[id] error:", error)
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!(await checkAdmin(req))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const { id } = await params
    const body = await req.json()

    const data: Record<string, unknown> = {}
    const fields = ["name", "tagline", "description", "artisticName", "badge", "keywords", "seoTitle", "seoDescription", "imageUrl"]
    const numberFields = ["price", "compareAtPrice", "cost"]
    const boolFields = ["isActive", "isTrending"]

    for (const f of fields) if (body[f] !== undefined) data[f] = body[f]
    if (body.image !== undefined) data.imageUrl = body.image
    for (const f of numberFields) if (body[f] !== undefined && body[f] !== null && body[f] !== "") data[f] = parseFloat(body[f])
    for (const f of boolFields) if (body[f] !== undefined) data[f] = !!body[f]
    if (body.stock !== undefined) data.stock = parseInt(body.stock)
    if (body.category) {
      const productCategory = await db.category.findUnique({ where: { name: body.category } })
      data.categoryId = productCategory?.id ?? null
    }

    const product = await db.product.update({ where: { id }, data })
    return NextResponse.json({ product })
  } catch (error) {
    console.error("PUT /api/products/[id] error:", error)
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!(await checkAdmin(req))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const { id } = await params
    await db.review.deleteMany({ where: { productId: id } })
    await db.product.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE /api/products/[id] error:", error)
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}
