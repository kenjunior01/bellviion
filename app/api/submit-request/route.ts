import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const supabase = await createClient()

    const { error } = await supabase.from("requests").insert({
      name: body.name,
      email: body.email,
      product_interest: body.productInterest,
      personalization: body.personalization,
      placement: body.placement,
      purpose: body.purpose,
      status: "pending",
    })

    if (error) throw error

    return NextResponse.json({ success: true, message: "Request submitted successfully" })
  } catch (error) {
    console.error("Error processing request:", error)
    return NextResponse.json({ success: false, message: "Failed to submit request" }, { status: 500 })
  }
}
