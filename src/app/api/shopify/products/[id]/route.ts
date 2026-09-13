import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { shopifyAdminQuery } from "@/lib/shopify-admin"

async function isAdmin(request: NextRequest) {
  const password = request.headers.get("x-admin-password")
  if (!password) return false
  const setting = await db.setting.findUnique({ where: { key: "admin_password" } })
  return setting?.value === password
}

const PRODUCT_QUERY = `query ProductByHandle($handle: String!) {
  productByHandle(handle: $handle) { id title descriptionHtml status variants(first: 1) { nodes { id price } } }
}`

const PRODUCT_UPDATE = `mutation ProductUpdate($input: ProductInput!) {
  productUpdate(input: $input) { product { id title descriptionHtml status } userErrors { field message } }
}`

const VARIANT_UPDATE = `mutation VariantUpdate($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
  productVariantsBulkUpdate(productId: $productId, variants: $variants) { productVariants { id price } userErrors { field message } }
}`

type ProductLookup = { productByHandle: { id: string; title: string; descriptionHtml: string | null; status: string; variants: { nodes: Array<{ id: string; price: string }> } } | null }

type ProductResult = { productUpdate: { userErrors: Array<{ field?: string[]; message: string }> } }
type VariantResult = { productVariantsBulkUpdate: { userErrors: Array<{ field?: string[]; message: string }> } }

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin(request))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  try {
    const { id } = await params
    const body = await request.json()
    const local = await db.product.findUnique({ where: { id } })
    if (!local) return NextResponse.json({ error: "Product not found" }, { status: 404 })
    const lookup = await shopifyAdminQuery<ProductLookup>(PRODUCT_QUERY, { handle: local.slug })
    if (!lookup.productByHandle) return NextResponse.json({ error: "Product is not published in Shopify" }, { status: 404 })

    const input: Record<string, unknown> = { id: lookup.productByHandle.id }
    if (body.name !== undefined) input.title = String(body.name).trim()
    if (body.description !== undefined) input.descriptionHtml = String(body.description)
    if (body.isActive !== undefined) input.status = body.isActive ? "ACTIVE" : "DRAFT"
    const productResult = await shopifyAdminQuery<ProductResult>(PRODUCT_UPDATE, { input })
    const productErrors = productResult.productUpdate.userErrors
    if (productErrors.length) return NextResponse.json({ error: productErrors.map((error) => error.message).join(", ") }, { status: 422 })

    if (body.price !== undefined && lookup.productByHandle.variants.nodes[0]) {
      const variantResult = await shopifyAdminQuery<VariantResult>(VARIANT_UPDATE, {
        productId: lookup.productByHandle.id,
        variants: [{ id: lookup.productByHandle.variants.nodes[0].id, price: String(body.price) }],
      })
      const variantErrors = variantResult.productVariantsBulkUpdate.userErrors
      if (variantErrors.length) return NextResponse.json({ error: variantErrors.map((error) => error.message).join(", ") }, { status: 422 })
    }

    const product = await db.product.update({ where: { id }, data: {
      ...(body.name !== undefined ? { name: String(body.name).trim() } : {}),
      ...(body.description !== undefined ? { description: String(body.description) } : {}),
      ...(body.price !== undefined ? { price: Number(body.price) } : {}),
      ...(body.isActive !== undefined ? { isActive: Boolean(body.isActive) } : {}),
    } })
    return NextResponse.json({ success: true, product })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Shopify product update failed" }, { status: 502 })
  }
}
