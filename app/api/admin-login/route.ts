import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { email, password } = await req.json()
  const adminEmail = process.env.ADMIN_EMAIL
  const adminPassword = process.env.ADMIN_PASSWORD

  if (email === adminEmail && password === adminPassword) {
    // Set a cookie for admin session (not HttpOnly so client can check)
    return NextResponse.json({ success: true }, {
      headers: {
        "Set-Cookie": `admin_auth=1; Path=/; SameSite=Lax; Max-Age=86400`
      }
    })
  }
  return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
}
