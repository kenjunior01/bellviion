import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { createSessionToken, hashPassword, sessionCookie, verifyPassword } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const action = body.action === "register" ? "register" : "login"
    const email = String(body.email || "").trim().toLowerCase()
    const password = String(body.password || "")
    if (!email.includes("@") || password.length < 8) return NextResponse.json({ error: "Use um email válido e password com pelo menos 8 caracteres." }, { status: 400 })

    let user = await db.user.findUnique({ where: { email } })
    if (action === "register") {
      if (user) return NextResponse.json({ error: "Email já registado." }, { status: 409 })
      user = await db.user.create({ data: { email, name: String(body.name || email.split("@")[0]), passwordHash: hashPassword(password) } })
    } else if (!user || !verifyPassword(password, user.passwordHash)) {
      return NextResponse.json({ error: "Credenciais inválidas." }, { status: 401 })
    }

    const response = NextResponse.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } })
    response.cookies.set(sessionCookie(createSessionToken(user.id)))
    return response
  } catch (error) {
    console.error("POST /api/auth error:", error)
    return NextResponse.json({ error: "Não foi possível autenticar." }, { status: 500 })
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true })
  response.cookies.delete("bellviion_session")
  return response
}
