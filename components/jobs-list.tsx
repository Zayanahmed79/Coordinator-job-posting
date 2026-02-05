"use client"

import { useState, useEffect } from "react"
import { JobCard, type Job } from "@/components/job-card"
import { Pagination } from "@/components/pagination"
import { Search } from "lucide-react"
import { supabase, type JobListing } from "@/lib/supabase"

const JOBS_PER_PAGE = 10

export function JobsList() {
  const [jobs, setJobs] = useState<JobListing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
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

  const filteredJobs = jobs.filter(
    (job) =>
      job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalPages = Math.ceil(filteredJobs.length / JOBS_PER_PAGE)
  const startIndex = (currentPage - 1) * JOBS_PER_PAGE
  const paginatedJobs = filteredJobs.slice(startIndex, startIndex + JOBS_PER_PAGE)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

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
        <div className="absolute left-5 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
          <Search className="h-5 w-5 text-muted-foreground/60" />
        </div>
        <input
          type="text"
          placeholder="Search by job title, company, or location..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            setCurrentPage(1)
          }}
          className="w-full pl-14 pr-6 py-5 bg-white border-2 border-border/40 rounded-2xl text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-base shadow-sm"
        />
      </div>

      {/* Count */}
      <div className="flex items-center justify-between mb-8">
        <p className="text-sm font-semibold text-foreground/70">
          Showing <span className="text-primary">{paginatedJobs.length}</span> of {filteredJobs.length} {filteredJobs.length === 1 ? "job" : "jobs"}
        </p>
      </div>

      {/* Jobs Grid */}
      {paginatedJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {paginatedJobs.map((job) => (
            <JobCard key={job.id} job={job as Job} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 rounded-2xl bg-background">
          <p className="text-foreground font-medium text-lg">No jobs found</p>
          <p className="text-muted-foreground mt-2 text-sm">Try adjusting your search criteria</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-12">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
      )}
    </div>
  )
}
