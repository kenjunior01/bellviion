import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

// Use service role key to bypass RLS
const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

export async function POST(request: Request) {
  try {
    const { action, email, password } = await request.json()

    if (action === "create_tables") {
      // Create categories table
      await supabaseAdmin
        .rpc("exec_sql", {
          sql: `
          CREATE TABLE IF NOT EXISTS categories (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            name TEXT NOT NULL UNIQUE,
            description TEXT,
            icon TEXT,
            created_at TIMESTAMPTZ DEFAULT NOW()
          );
        `,
        })
        .catch(() => {})

      // Create products table
      await supabaseAdmin
        .rpc("exec_sql", {
          sql: `
          CREATE TABLE IF NOT EXISTS products (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            name TEXT NOT NULL,
            artistic_name TEXT,
            description TEXT,
            price DECIMAL(10,2) NOT NULL,
            category_id UUID,
            image_url TEXT,
            specs JSONB DEFAULT '{}',
            is_active BOOLEAN DEFAULT true,
            stock INTEGER DEFAULT 0,
            created_at TIMESTAMPTZ DEFAULT NOW()
          );
        `,
        })
        .catch(() => {})

      // Create agents table
      await supabaseAdmin
        .rpc("exec_sql", {
          sql: `
          CREATE TABLE IF NOT EXISTS agents (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            phone TEXT NOT NULL,
            age INTEGER NOT NULL,
            country TEXT NOT NULL,
            province TEXT NOT NULL,
            city TEXT,
            status TEXT DEFAULT 'pending',
            commission_rate DECIMAL(5,2) DEFAULT 10.00,
            total_sales DECIMAL(10,2) DEFAULT 0,
            notes TEXT,
            created_at TIMESTAMPTZ DEFAULT NOW()
          );
        `,
        })
        .catch(() => {})

      // Create admins table
      await supabaseAdmin
        .rpc("exec_sql", {
          sql: `
          CREATE TABLE IF NOT EXISTS admins (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID,
            email TEXT NOT NULL UNIQUE,
            role TEXT DEFAULT 'admin',
            created_at TIMESTAMPTZ DEFAULT NOW()
          );
        `,
        })
        .catch(() => {})

      return NextResponse.json({ success: true, message: "Tabelas criadas" })
    }

    if (action === "create_admin") {
      if (!email || !password) {
        return NextResponse.json({ error: "Email e senha são obrigatórios" }, { status: 400 })
      }

      // Create auth user
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      })

      if (authError && !authError.message.includes("already been registered")) {
        return NextResponse.json({ error: authError.message }, { status: 400 })
      }

      // Get user id
      let userId = authData?.user?.id
      if (!userId) {
        const { data: users } = await supabaseAdmin.auth.admin.listUsers()
        const existingUser = users?.users?.find((u) => u.email === email)
        userId = existingUser?.id
      }

      if (userId) {
        // Insert into admins table
        const { error: adminError } = await supabaseAdmin
          .from("admins")
          .upsert({ user_id: userId, email, role: "super_admin" }, { onConflict: "email" })

        if (adminError) {
          console.error("Admin insert error:", adminError)
        }
      }

      return NextResponse.json({ success: true, message: "Admin criado com sucesso", userId })
    }

    if (action === "seed_data") {
      // Insert categories
      const { data: categories } = await supabaseAdmin
        .from("categories")
        .upsert(
          [
            { name: "Óculos", description: "Óculos de sol premium BELLVION", icon: "glasses" },
            { name: "Relógios", description: "Relógios de luxo BELLVION", icon: "watch" },
            { name: "Colecionáveis", description: "Peças exclusivas de coleção", icon: "gem" },
          ],
          { onConflict: "name" },
        )
        .select()

      // Get category IDs
      const { data: cats } = await supabaseAdmin.from("categories").select("id, name")
      const oculosId = cats?.find((c) => c.name === "Óculos")?.id
      const relogiosId = cats?.find((c) => c.name === "Relógios")?.id

      // Insert products
      if (oculosId && relogiosId) {
        await supabaseAdmin.from("products").upsert(
          [
            {
              name: "BELLVION Classic Black",
              artistic_name: "Obsidian Vision",
              description: "Elegância atemporal em armação preta fosca",
              price: 3500.0,
              category_id: oculosId,
              image_url: "/luxury-black-sunglasses.jpg",
              is_active: true,
              stock: 10,
            },
            {
              name: "BELLVION Gold Edition",
              artistic_name: "Solar Crown",
              description: "Detalhes dourados em design contemporâneo",
              price: 3500.0,
              category_id: oculosId,
              image_url: "/luxury-gold-sunglasses.jpg",
              is_active: true,
              stock: 8,
            },
            {
              name: "BELLVION Chronograph",
              artistic_name: "Eternal Time",
              description: "Relógio automático com cronógrafo suíço",
              price: 4250.0,
              category_id: relogiosId,
              image_url: "/luxury-chronograph-watch.jpg",
              is_active: true,
              stock: 5,
            },
            {
              name: "BELLVION Minimalist",
              artistic_name: "Pure Essence",
              description: "Design minimalista com movimento japonês",
              price: 4250.0,
              category_id: relogiosId,
              image_url: "/luxury-minimalist-watch.jpg",
              is_active: true,
              stock: 7,
            },
          ],
          { onConflict: "name" },
        )
      }

      return NextResponse.json({ success: true, message: "Dados inseridos com sucesso" })
    }

    return NextResponse.json({ error: "Ação inválida" }, { status: 400 })
  } catch (error: any) {
    console.error("Init database error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
