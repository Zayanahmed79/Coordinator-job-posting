"use client"

import Link from "next/link"
import { Building2 } from "lucide-react"

export interface Job {
  id: string
  title: string
  description: string
  location: string
  company: string
  apply_link: string
  job_type: string
  type?: string
  pipline_id: number | null
  experience: string | null
  created_at: string
  ai_job_description: string | null
  questions?: any[]
}

interface JobCardProps {
  job: Job
}

export function JobCard({ job }: JobCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  return (
    <div className="bg-card rounded-2xl p-5 sm:p-6 border border-border shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="shrink-0 w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center border border-border/50">
            <Building2 className="w-6 h-6 text-muted-foreground/70" />
          </div>
          <div className="flex-1 min-w-0 pt-0.5">
            <h3 className="text-xl font-bold text-foreground leading-tight">{job.title || "Untitled Position"}</h3>
            <p className="text-muted-foreground text-md font-medium mt-1 uppercase tracking-wide">{job.company || "Company"}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {/* Date only */}
          {job.created_at && (
            <div className="text-md text-muted-foreground/80">
              <span>{formatDate(job.created_at)}</span>
            </div>
          )}

          {/* AI summary */}
          {job.ai_job_description && (
            <p className="text-lg text-[#1A202C] leading-relaxed">
              {job.ai_job_description}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-4 pt-3 mt-auto border-t border-border/50">
          <Link
            href={`/jobs/${job.pipline_id || job.id}`}
            className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground text-md font-bold rounded-full hover:bg-primary/90 hover:shadow-lg active:scale-[0.98] transition-all whitespace-nowrap"
          >
            Apply Now
          </Link>
        </div>
      </div>
    </div>
  )
}
