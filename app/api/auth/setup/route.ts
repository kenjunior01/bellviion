import { createClient } from "@supabase/supabase-js"
import { createServerClient } from "@supabase/ssr"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { action, email, password } = body

    console.log("[v0] Setup API called with action:", action)
    console.log("[v0] SUPABASE_URL exists:", !!process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log("[v0] SERVICE_ROLE_KEY exists:", !!process.env.SUPABASE_SERVICE_ROLE_KEY)

    // Validate inputs
    if (!action || !email || !password) {
      return NextResponse.json({ success: false, error: "Dados em falta" }, { status: 400 })
    }

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error("[v0] SUPABASE_SERVICE_ROLE_KEY is not set!")
      return NextResponse.json(
        {
          success: false,
          error: "Configuração do servidor incompleta. A chave de serviço do Supabase não está configurada.",
        },
        { status: 500 },
      )
    }

    // Use service role key for admin operations (create user)
    const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    if (action === "create") {
      console.log("[v0] Attempting to create user:", email)

      // Check if user already exists first
      const { data: existingUsers, error: listError } = await supabaseAdmin.auth.admin.listUsers()

      if (listError) {
        console.error("[v0] Error listing users:", listError)
        return NextResponse.json({ success: false, error: listError.message }, { status: 400 })
      }

      const userExists = existingUsers?.users?.some((u) => u.email === email)
      console.log("[v0] User exists:", userExists)

      if (userExists) {
        return NextResponse.json({
          success: true,
          message: "Utilizador já existe. Tente fazer login.",
          exists: true,
        })
      }

      // Create user with admin API
      const { data: userData, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      })

      if (createError) {
        console.error("[v0] Create user error:", createError)
        return NextResponse.json({ success: false, error: createError.message }, { status: 400 })
      }

      console.log("[v0] User created successfully:", userData.user?.id)

      // Add to admins table
      if (userData.user) {
        const { error: adminError } = await supabaseAdmin.from("admins").upsert(
          {
            user_id: userData.user.id,
            email: email,
            role: "super_admin",
          },
          { onConflict: "email" },
        )

        if (adminError) {
          console.error("[v0] Error adding to admins table:", adminError)
        } else {
          console.log("[v0] Admin record updated")
        }
      }

      return NextResponse.json({
        success: true,
        message: "Utilizador criado com sucesso!",
        user: { id: userData.user?.id, email: userData.user?.email },
      })
    }

    if (action === "login") {
      console.log("[v0] Attempting login for:", email)

      const cookieStore = await cookies()

      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() {
              return cookieStore.getAll()
            },
            setAll(cookiesToSet) {
              try {
                cookiesToSet.forEach(({ name, value, options }) => {
                  cookieStore.set(name, value, options)
                })
              } catch (e) {
                // Server component - ignore
              }
            },
          },
        },
      )

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("[v0] Login error:", error)
        return NextResponse.json({ success: false, error: error.message }, { status: 401 })
      }

      console.log("[v0] Login successful for:", data.user?.email)

      return NextResponse.json({
        success: true,
        message: "Login efectuado com sucesso!",
        user: { id: data.user?.id, email: data.user?.email },
      })
    }

    return NextResponse.json({ success: false, error: "Ação inválida" }, { status: 400 })
  } catch (error) {
    console.error("[v0] Setup API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Erro interno do servidor",
      },
      { status: 500 },
    )
  }
}

// Add GET handler for health check
export async function GET() {
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    env: {
      supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      anonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      serviceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    },
  })
}
