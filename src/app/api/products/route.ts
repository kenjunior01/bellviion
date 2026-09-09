import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const sort = searchParams.get("sort") || "trending"
    const featured = searchParams.get("featured")

    const where: Record<string, unknown> = { isActive: true }

    if (category && category !== "all") where.category = { name: category }
    if (featured === "true") where.isTrending = true
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { keywords: { contains: search } },
      ]
    }

    let orderBy: Record<string, string> = { soldCount: "desc" }
    if (sort === "price-asc") orderBy = { price: "asc" }
    else if (sort === "price-desc") orderBy = { price: "desc" }
    else if (sort === "rating") orderBy = { rating: "desc" }
    else if (sort === "newest") orderBy = { createdAt: "desc" }

    const products = await db.product.findMany({
      where,
      orderBy,
      include: { category: true },
    })

    return NextResponse.json({
      products: products.map(({ category: productCategory, imageUrl, artisticName, ...product }) => ({
        ...product,
        image: imageUrl,
        artistic_name: artisticName,
        category: productCategory?.name ?? null,
        price: Number(product.price),
        compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
      })),
    })
  } catch (error) {
    console.error("GET /api/products error:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const password = req.headers.get("x-admin-password")
    const valid = await db.setting.findUnique({ where: { key: "admin_password" } })
    if (!valid || password !== valid.value) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const {
      name, tagline, description, category, price, compareAtPrice, cost,
      image, badge, isTrending, stock, keywords, seoTitle, seoDescription,
    } = body

    if (!name || !price || !image) {
      return NextResponse.json({ error: "Name, price and image are required" }, { status: 400 })
    }

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") + "-" + Date.now().toString(36).slice(-4)

    const productCategory = category
      ? await db.category.findUnique({ where: { name: category } })
      : null

    const product = await db.product.create({
      data: {
        slug,
        name,
        tagline: tagline || "",
        description: description || "",
        price: parseFloat(price),
        compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : null,
        cost: cost ? parseFloat(cost) : null,
        imageUrl: image,
        categoryId: productCategory?.id ?? null,
        badge: badge || "NEW",
        isTrending: !!isTrending,
        stock: stock ? parseInt(stock) : 100,
        keywords: keywords || "",
        seoTitle: seoTitle || `${name} | Bellviion`,
        seoDescription: seoDescription || (description || "").slice(0, 155),
        rating: 4.8,
        reviewCount: 0,
        soldCount: 0,
      },
    })

    return NextResponse.json({ product })
  } catch (error) {
    console.error("POST /api/products error:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
