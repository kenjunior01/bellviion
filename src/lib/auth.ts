import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto"
import { cookies } from "next/headers"
import { db } from "@/lib/db"
import type { UserRole } from "@prisma/client"

const COOKIE = "bellviion_session"
const secret = () => process.env.AUTH_SECRET || process.env.NEON_STACK_SECRET_SERVER_KEY || "development-only-secret"

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex")
  return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`
}

export function verifyPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(":")
  if (!salt || !hash) return false
  const derived = scryptSync(password, salt, 64)
  return timingSafeEqual(derived, Buffer.from(hash, "hex"))
}

function sign(value: string) {
  return createHmac("sha256", secret()).update(value).digest("hex")
}

export function createSessionToken(userId: string) {
  const payload = `${userId}.${Date.now() + 1000 * 60 * 60 * 24 * 30}`
  return `${payload}.${sign(payload)}`
}

export async function getCurrentUser() {
  const token = (await cookies()).get(COOKIE)?.value
  if (!token) return null
  const [userId, expiry, signature] = token.split(".")
  const payload = `${userId}.${expiry}`
  if (!userId || !expiry || !signature || Number(expiry) < Date.now() || sign(payload) !== signature) return null
  return db.user.findUnique({ where: { id: userId }, select: { id: true, email: true, name: true, role: true, affiliateId: true } })
}

export async function requireRole(roles: UserRole[]) {
  const user = await getCurrentUser()
  if (!user || !roles.includes(user.role)) return null
  return user
}

export const sessionCookie = (token: string) => ({ name: COOKIE, value: token, httpOnly: true, sameSite: "lax" as const, secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 30 })
