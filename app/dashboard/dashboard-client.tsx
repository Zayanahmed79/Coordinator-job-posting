"use client"

import { useEffect, useState } from "react"

interface Candidate {
  id: string
  name?: string
  email?: string
  phone?: string
  skills?: string
  experience?: string
  [key: string]: any
}

export default function DashboardPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch("/api/candidates")
      .then(res => res.json())
      .then(data => {
        setCandidates(data)
        setLoading(false)
      })
      .catch(() => {
        setError("Failed to fetch candidates.")
        setLoading(false)
      })
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}
      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow">
            <thead>
              <tr>
                <th className="p-2 border">ID</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Phone</th>
                <th className="p-2 border">Skills</th>
                <th className="p-2 border">Experience</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map(c => (
                <tr key={c.id}>
                  <td className="p-2 border">{c.id}</td>
                  <td className="p-2 border">{c.name || "-"}</td>
                  <td className="p-2 border">{c.email || "-"}</td>
                  <td className="p-2 border">{c.phone || "-"}</td>
                  <td className="p-2 border">{c.skills || "-"}</td>
                  <td className="p-2 border">{c.experience || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
