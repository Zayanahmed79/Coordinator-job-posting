"use client"

import { useState } from "react"
import { MapPin, Building2, ChevronDown, ChevronUp, ExternalLink } from "lucide-react"

export interface Job {
  id: string
  title: string
  description: string
  location: string
  company: string
  apply_link: string
  type: string
  created_at: string
}

interface JobCardProps {
  job: Job
}

export function JobCard({ job }: JobCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const truncateDescription = (text: string, maxLength = 150) => {
    if (!text) return ""
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength).trim() + "..."
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  return (
    <div className="bg-card rounded-2xl p-5 sm:p-6 border border-border shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex flex-col gap-4">
        {/* Header with company icon and info */}
        <div className="flex items-start gap-4">
          <div className="shrink-0 w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center border border-border/50">
            <Building2 className="w-6 h-6 text-muted-foreground/70" />
          </div>
          <div className="flex-1 min-w-0 pt-0.5">
            <h3 className="text-lg font-bold text-foreground leading-tight">{job.title || "Untitled Position"}</h3>
            <p className="text-muted-foreground text-sm font-medium mt-1 uppercase tracking-wide">{job.company || "Company"}</p>
          </div>
          {job.type && (
            <span className="shrink-0 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase bg-primary/10 text-primary border border-primary/20">
              {job.type}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-3">
          {/* Location and Date */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground/80">
            {job.location && (
              <span className="flex items-center gap-1.5 min-w-0">
                <MapPin className="w-4 h-4 shrink-0 text-primary/60" />
                <span className="truncate">{job.location}</span>
              </span>
            )}
            {job.created_at && (
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-border md:block hidden" />
                <span>{formatDate(job.created_at)}</span>
              </span>
            )}
          </div>

          {/* Description */}
          {job.description && (
            <div className="relative">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {isExpanded ? job.description : truncateDescription(job.description)}
                {job.description.length > 150 && (
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="ml-1 inline-flex items-center gap-0.5 text-sm font-semibold text-primary hover:underline transition-all"
                  >
                    {isExpanded ? "Show less" : "Read more"}
                  </button>
                )}
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        {job.apply_link && (
          <div className="flex flex-wrap items-center gap-4 pt-3 mt-auto border-t border-border/50">
            <a
              href={job.apply_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground text-sm font-bold rounded-full hover:bg-primary/90 hover:shadow-lg active:scale-[0.98] transition-all whitespace-nowrap"
            >
              Apply Now
            </a>
            <a
              href={job.apply_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:gap-3 transition-all whitespace-nowrap"
            >
              View Details <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
