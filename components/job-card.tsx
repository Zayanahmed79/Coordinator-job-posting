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
    <div className="bg-background rounded-2xl p-6 border border-border hover:shadow-lg transition-all duration-200">
      <div className="flex flex-col gap-4">
        {/* Header with company icon and info */}
        <div className="flex items-start gap-4">
          <div className="shrink-0 w-12 h-12 rounded-full bg-muted flex items-center justify-center">
            <Building2 className="w-6 h-6 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-foreground">{job.title || "Untitled Position"}</h3>
            </div>
            <p className="text-muted-foreground text-sm">{job.company || "Company"}</p>
          </div>
          {job.type && (
            <span className="shrink-0 px-3 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
              {job.type}
            </span>
          )}
        </div>

        {/* Location and Date */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {job.location && (
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              {job.location}
            </span>
          )}
          {job.created_at && (
            <span>{formatDate(job.created_at)}</span>
          )}
        </div>

        {/* Description */}
        {job.description && (
          <div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {isExpanded ? job.description : truncateDescription(job.description)}
              {job.description.length > 150 && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="ml-1 inline-flex items-center gap-0.5 text-sm font-medium text-primary hover:text-[#e06610] transition-colors"
                >
                  {isExpanded ? (
                    <>
                      Show less <ChevronUp className="w-3.5 h-3.5" />
                    </>
                  ) : (
                    <>
                      Read more <ChevronDown className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              )}
            </p>
          </div>
        )}

        {/* Actions */}
        {job.apply_link && (
          <div className="flex items-center gap-4 pt-2">
            <a
              href={job.apply_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground text-sm font-semibold rounded-full hover:bg-[#e06610] active:scale-[0.98] transition-all"
            >
              Apply Now
            </a>
            <a
              href={job.apply_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-[#e06610] transition-colors"
            >
              View Details <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
