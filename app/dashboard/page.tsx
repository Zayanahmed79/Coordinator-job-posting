"use client"
import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const supabase = createClient(supabaseUrl, supabaseKey)

export default function Dashboard() {
  const [candidates, setCandidates] = useState<any[]>([])
  const [selected, setSelected] = useState<any | null>(null)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    // Check for admin_auth cookie
    if (typeof window !== "undefined") {
      const match = document.cookie.match(/(?:^|; )admin_auth=([^;]*)/)
      if (!match || match[1] !== "1") {
        window.location.href = "/login"
      } else {
        fetchCandidates()
      }
      setCheckingAuth(false)
    }
    // eslint-disable-next-line
  }, [])

  const fetchCandidates = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from("candidate")
      .select(`id, full_name, email, phone, location, headline, bio, summary, skills, experience_summary, education_summary, linkedin_url, website, current_job_title, years_of_experience, video_link, uploaded_at`)
    if (error) {
      setError(error.message)
    } else {
      setCandidates(data || [])
    }
    setLoading(false)
  }





  if (checkingAuth) return null;

  // Only show dashboard if authenticated
  if (typeof window !== "undefined") {
    const match = document.cookie.match(/(?:^|; )admin_auth=([^;]*)/)
    if (!match || match[1] !== "1") {
      window.location.replace("/login");
      return null;
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] p-8">
      <h1 className="text-4xl font-extrabold mb-10 text-primary">Dashboard</h1>
      {loading && <div className="text-lg text-muted-foreground">Loading...</div>}
      {error && <div className="text-red-600 font-semibold">{error}</div>}
      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-2xl shadow-lg border border-border text-xs md:text-sm">
            <thead className="bg-primary/10">
              <tr>
                <th className="p-3 border-b font-bold text-primary">ID</th>
                <th className="p-3 border-b font-bold text-primary">Full Name</th>
                <th className="p-3 border-b font-bold text-primary">Email</th>
                <th className="p-3 border-b font-bold text-primary">Phone</th>
                <th className="p-3 border-b font-bold text-primary">Location</th>
                <th className="p-3 border-b font-bold text-primary">Headline</th>
                <th className="p-3 border-b font-bold text-primary">Skills</th>
                <th className="p-3 border-b font-bold text-primary">Current Job Title</th>
                <th className="p-3 border-b font-bold text-primary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((c, i) => (
                <tr key={c.id} className={i % 2 === 0 ? "bg-white" : "bg-primary/5"}>
                  <td className="p-3 border-b text-foreground font-semibold">{c.id}</td>
                  <td className="p-3 border-b text-foreground">{c.full_name || "-"}</td>
                  <td className="p-3 border-b text-foreground">{c.email || "-"}</td>
                  <td className="p-3 border-b text-foreground">{c.phone || "-"}</td>
                  <td className="p-3 border-b text-foreground">{c.location || "-"}</td>
                  <td className="p-3 border-b text-foreground">{c.headline || "-"}</td>
                  <td className="p-3 border-b text-foreground max-w-[18ch] truncate" title={c.skills || "-"}>{c.skills || "-"}</td>
                  <td className="p-3 border-b text-foreground">{c.current_job_title || "-"}</td>
                  <td className="p-3 border-b text-foreground">
                    <button
                      className="px-3 py-1 rounded bg-primary text-primary-foreground hover:bg-[#e06610] font-semibold text-xs"
                      onClick={() => setSelected(c)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Popup Dialog for Candidate Details */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden">
            <div className="flex items-start justify-between gap-4 p-6 border-b border-muted/20">
              <div>
                <h3 className="text-3xl font-extrabold text-primary">Candidate Details</h3>
              </div>
              <div className="flex items-center gap-3">
                <button
                  className="px-3 py-2 rounded-md bg-primary text-primary-foreground hover:bg-[#e06610] transition font-semibold"
                  onClick={() => {
                    if (selected.video_link) window.open(selected.video_link, "_blank")
                  }}
                  disabled={!selected.video_link}
                >
                  {selected.video_link ? "Open Video" : "No Video"}
                </button>
                <button
                  className="w-10 h-10 rounded-full bg-muted/20 flex items-center justify-center text-muted-foreground hover:bg-muted transition"
                  onClick={() => setSelected(null)}
                  aria-label="Close details"
                >
                  ✖
                </button>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="col-span-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-muted-foreground font-semibold">Full name</div>
                    <div className="text-lg font-bold text-foreground">{selected.full_name || "-"}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground font-semibold">Headline</div>
                    <div className="text-base text-foreground">{selected.headline || "-"}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground font-semibold">Email</div>
                    <div className="flex items-center gap-3">
                      <div className="text-foreground">{selected.email || "-"}</div>
                      {selected.email && (
                        <button
                          className="text-xs text-primary underline"
                          onClick={() => { navigator.clipboard.writeText(selected.email); }}
                        >Copy</button>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground font-semibold">Phone</div>
                    <div className="text-foreground">{selected.phone || "-"}</div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-sm text-muted-foreground font-semibold mb-2">Summary</div>
                  <div className="text-sm text-foreground whitespace-pre-line">{selected.summary || "-"}</div>
                </div>

                <div className="mb-4">
                  <div className="text-sm text-muted-foreground font-semibold mb-2">Experience Summary</div>
                  <div className="text-sm text-foreground whitespace-pre-line">{selected.experience_summary || "-"}</div>
                </div>

                <div>
                  <div className="text-sm text-muted-foreground font-semibold mb-2">Education</div>
                  <div className="text-sm text-foreground whitespace-pre-line">{selected.education_summary || "-"}</div>
                </div>
              </div>

              <div className="col-span-1 bg-muted/5 rounded-xl p-4">
                <div className="mb-4">
                  <div className="text-sm text-muted-foreground font-semibold">Skills</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(selected.skills || "").split(/\s*,\s*/).filter(Boolean).slice(0,12).map((s: string, idx: number) => (
                      <span key={idx} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold">{s}</span>
                    ))}
                    {!(selected.skills || "") && <div className="text-sm text-muted-foreground">-</div>}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-sm text-muted-foreground font-semibold">Links</div>
                  <div className="mt-2 flex flex-col gap-2">
                    <a className={`text-sm ${selected.linkedin_url ? 'text-blue-600 underline' : 'text-muted-foreground'}`} href={selected.linkedin_url || '#'} target="_blank" rel="noreferrer">{selected.linkedin_url ? 'LinkedIn profile' : '—'}</a>
                    <a className={`text-sm ${selected.website ? 'text-blue-600 underline' : 'text-muted-foreground'}`} href={selected.website || '#'} target="_blank" rel="noreferrer">{selected.website ? 'Website' : '—'}</a>
                  </div>
                </div>

                <div>
                  <div className="text-sm text-muted-foreground font-semibold">Uploaded</div>
                  <div className="text-sm text-foreground mt-1">{selected.uploaded_at ? new Date(selected.uploaded_at).toLocaleString() : '-'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
