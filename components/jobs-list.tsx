"use client"

import { useState, useEffect } from "react"
import { JobCard, type Job } from "@/components/job-card"
import { Search } from "lucide-react"
import { supabase, type JobListing } from "@/lib/supabase"

const INITIAL_COUNT = 6
const LOAD_MORE_COUNT = 6

export function JobsList() {
  const [jobs, setJobs] = useState<JobListing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    async function fetchJobs() {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from("job_listings")
          .select("*")
          .order("created_at", { ascending: false })

        if (error) throw error
        setJobs(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch jobs")
      } finally {
        setLoading(false)
      }
    }
    fetchJobs()
  }, [])

  // Reset visible count when search changes
  const handleSearch = (q: string) => {
    setSearchQuery(q)
    setVisibleCount(INITIAL_COUNT)
  }

  const filteredJobs = jobs.filter(
    (job) =>
      job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const visibleJobs = filteredJobs.slice(0, visibleCount)
  const hasMore = visibleCount < filteredJobs.length

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
      <div className="text-center py-16 rounded-2xl bg-background">
        <p className="text-destructive font-medium">Error loading jobs</p>
        <p className="text-muted-foreground mt-1 text-sm">{error}</p>
      </div>
    )
  }

  return (
    <div>
      {/* Search */}
      <div className="relative mb-10">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none">
          <Search className="h-6 w-6 text-muted-foreground" />
        </div>
        <input
          type="text"
          placeholder="Search by job title, company, or location..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full pl-14 pr-6 py-5 bg-white border-2 border-border/80 rounded-2xl text-foreground placeholder:text-muted-foreground/80 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-lg shadow-sm"
        />
      </div>

      {/* Count */}
      <div className="flex items-center justify-between mb-8">
        <p className="text-lg font-semibold text-foreground/80">
          Showing <span className="text-primary">{visibleJobs.length}</span> of {filteredJobs.length} {filteredJobs.length === 1 ? "job" : "jobs"}
        </p>
      </div>

      {/* Jobs Grid */}
      {visibleJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {visibleJobs.map((job) => (
            <JobCard key={job.id} job={job as Job} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 rounded-2xl bg-background">
          <p className="text-foreground font-medium text-lg">No jobs found</p>
          <p className="text-muted-foreground mt-2 text-sm">Try adjusting your search criteria</p>
        </div>
      )}

      {/* View more */}
      {hasMore && (
        <div className="mt-10 flex justify-center">
          <button
            onClick={() => setVisibleCount((c) => c + LOAD_MORE_COUNT)}
            className="px-10 py-3.5 rounded-full border-2 border-primary text-primary font-bold text-base hover:bg-primary hover:text-primary-foreground transition-all duration-200 active:scale-[0.98]"
          >
            View more jobs
          </button>
        </div>
      )}
    </div>
  )
}
