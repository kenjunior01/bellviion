import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

// This route helps set up the initial admin user
// It should only be used once during initial setup

export async function POST(request: Request) {
  try {
    const { email, password, secretKey } = await request.json()

    // Simple security check - only allow setup with correct secret
    if (secretKey !== "BELLVION_SETUP_2025") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Create admin client with service role key
    const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    // Check if user already exists
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
    const userExists = existingUsers?.users?.some((u) => u.email === email)

    let userId: string

    if (userExists) {
      // Get existing user ID
      const existingUser = existingUsers?.users?.find((u) => u.email === email)
      userId = existingUser!.id
    } else {
      // Create auth user
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      })

      if (authError) {
        return NextResponse.json({ error: authError.message }, { status: 400 })
      }

      userId = authData.user.id
    }

    // Check if admin entry exists
    const { data: existingAdmin } = await supabaseAdmin.from("admins").select("id").eq("email", email).single()

    if (!existingAdmin) {
      // Add to admins table
      const { error: adminError } = await supabaseAdmin.from("admins").insert({
        user_id: userId,
        email,
        role: "super_admin",
      })

      if (adminError) {
        return NextResponse.json({ error: adminError.message }, { status: 400 })
      }
    }

    return NextResponse.json({
      success: true,
      message: "Admin user created/verified successfully",
      userId,
    })
  } catch (error) {
    console.error("Setup error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Setup failed",
      },
      { status: 500 },
    )
  }
}
