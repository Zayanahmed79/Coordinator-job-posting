"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { ChevronDown } from "lucide-react"
import { supabase, type JobListing } from "@/lib/supabase"

const HEALTHCARE_KEYWORDS = [
  "health", "healthcare", "medical", "clinic", "hospital", "nurse", "nursing",
  "physician", "doctor", "patient", "care", "dental", "therapy", "therapist",
  "pharmacy", "pharmacist", "radiology", "surgery", "surgical", "behavioral",
  "mental health", "home health", "assisted living", "senior care", "elder care",
  "rehab", "rehabilitation", "icu", "er", "emergency", "pediatric", "oncology",
  "cardiology", "orthopedic", "telehealth", "telemedicine", "ehr", "emr",
  "hipaa", "cna", "lpn", "rn", "np", "pa", "aide", "caregiver", "coordinator",
]

function isHealthcareJob(job: JobListing): boolean {
  const fields = [job.title, job.company, job.description].join(" ").toLowerCase()
  return HEALTHCARE_KEYWORDS.some((kw) => fields.includes(kw))
}

export function HealthcareJobsList() {
  const [jobs, setJobs] = useState<JobListing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [locationFilter, setLocationFilter] = useState("")

  useEffect(() => {
    async function fetchJobs() {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from("job_listings")
          .select("*")
          .order("created_at", { ascending: false })
        if (error) throw error
        setJobs((data || []).filter(isHealthcareJob))
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch jobs")
      } finally {
        setLoading(false)
      }
    }
    fetchJobs()
  }, [])

  const filtered = jobs.filter((job) => {
    const q = searchQuery.toLowerCase()
    const matchesSearch = !q ||
      job.title?.toLowerCase().includes(q) ||
      job.company?.toLowerCase().includes(q) ||
      job.location?.toLowerCase().includes(q)
    const loc = job.location?.toLowerCase() || ""
    const matchesLocation =
      !locationFilter ||
      (locationFilter === "Remote" && loc.includes("remote")) ||
      (locationFilter === "On-site" && !loc.includes("remote"))
    return matchesSearch && matchesLocation
  })

  // Group by company
  const grouped = useMemo(() => {
    const map = new Map<string, JobListing[]>()
    filtered.forEach((job) => {
      const key = job.company || "Other"
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(job)
    })
    return map
  }, [filtered])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground mt-4 text-sm">Loading jobs...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-destructive font-medium">Error loading jobs</p>
        <p className="text-muted-foreground mt-1 text-sm">{error}</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Filters row */}
      <div className="flex flex-col sm:flex-row gap-3 mb-10">
        {/* Location dropdown */}
        <div className="relative">
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="appearance-none pl-4 pr-10 py-2.5 border border-border rounded-md text-sm text-slate-600 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer min-w-[150px]"
          >
            <option value="">Locations</option>
            <option value="Remote">Remote</option>
            <option value="On-site">On-site</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search jobs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-4 py-2.5 border border-border rounded-md text-sm text-foreground placeholder:text-muted-foreground bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Flat job listings */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-foreground font-medium text-lg">No healthcare jobs found</p>
          <p className="text-muted-foreground mt-2 text-sm">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="border border-border divide-y divide-border">
          {filtered.map((job) => (
            <div key={job.id} className="flex items-center justify-between px-5 py-5 bg-white hover:bg-[#1E3A5F]/5 transition-colors">
              <div className="space-y-1">
                <p className="font-bold text-[#1E3A5F] uppercase text-sm tracking-wide">{job.title}</p>
                {job.location && (
                  <p className="text-sm text-slate-400">{job.location}</p>
                )}
                {job.type && (
                  <p className="text-xs text-slate-400">{job.type}</p>
                )}
              </div>
              <Link
                href={`/jobs/${job.pipline_id || job.id}`}
                className="shrink-0 ml-6 px-6 py-2.5 bg-[#1E3A5F] hover:bg-[#F47521] text-white text-sm font-semibold rounded-full transition-colors"
              >
                Apply
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
