"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    // Call API route to check credentials
    const res = await fetch("/api/admin-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    })
    if (res.ok) {
      router.push("/dashboard")
    } else {
      setError("Invalid credentials")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm flex flex-col gap-5 border border-border">
        <h2 className="text-3xl font-extrabold mb-2 text-center text-primary">Admin Login</h2>
        <p className="text-muted-foreground text-center mb-2">Sign in to access the dashboard</p>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="border border-border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="border border-border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
          required
        />
        {error && <div className="text-red-600 text-sm text-center font-semibold">{error}</div>}
        <button
          type="submit"
          className="bg-primary text-primary-foreground py-3 rounded-lg font-bold hover:bg-[#e06610] transition text-lg shadow"
        >
          Login
        </button>
      </form>
    </div>
  )
}
