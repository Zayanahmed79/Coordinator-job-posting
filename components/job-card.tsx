"use client"

import { useState } from "react"
import Link from "next/link"
import { MapPin, Building2 } from "lucide-react"
import { cn } from "@/lib/utils"

export interface Job {
  id: string
  title: string
  description: string
  location: string
  company: string
  apply_link: string
  type: string
  pipline_id: number | null
  experience: string | null
  created_at: string
  questions?: any[]
}

interface JobCardProps {
  job: Job
}

export function JobCard({ job }: JobCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const stripHtml = (html: string) => {
    if (typeof document === 'undefined') return html
    const tmp = document.createElement("DIV")
    tmp.innerHTML = html
    return tmp.textContent || tmp.innerText || ""
  }

  const truncateDescription = (text: string, maxLength = 160) => {
    if (!text) return ""
    const plainText = stripHtml(text)
    if (plainText.length <= maxLength) return plainText
    return plainText.slice(0, maxLength).trim() + "..."
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
            <h3 className="text-xl font-bold text-foreground leading-tight">{job.title || "Untitled Position"}</h3>
            <p className="text-muted-foreground text-md font-medium mt-1 uppercase tracking-wide">{job.company || "Company"}</p>
          </div>
          {job.type && (
            <span className="shrink-0 px-2.5 py-1 rounded-lg text-[14px] font-bold uppercase bg-primary/10 text-primary border border-primary/20">
              {job.type}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-3">
          {/* Location and Date */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-md text-muted-foreground/80">
            {job.location && (
              <span className="flex items-center gap-1.5 min-w-0">
                <MapPin className="w-4 h-4 shrink-0 text-primary/80" />
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
              <div
                className={cn(
                  "text-lg text-[#1A202C] leading-relaxed transition-all duration-300",
                  !isExpanded && "max-h-[100px] overflow-hidden relative"
                )}
                dangerouslySetInnerHTML={{
                  __html: (() => {
                    if (typeof document === "undefined") return ""
                    if (isExpanded) {
                      // Show full decoded HTML when expanded
                      const txt = document.createElement("textarea")
                      txt.innerHTML = job.description
                      const decoded = txt.value
                      if (decoded.includes("&lt;") || decoded.includes("&gt;")) {
                        txt.innerHTML = decoded
                        return txt.value
                      }
                      return decoded
                    }
                    // Show truncated plain text preview
                    return truncateDescription(job.description)
                  })()
                }}
              />
              {!isExpanded && job.description.length > 160 && (
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-linear-to-t from-white to-transparent pointer-events-none" />
              )}
              {job.description.length > 160 && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsExpanded(!isExpanded);
                  }}
                  className="mt-2 inline-flex items-center gap-0.5 text-md font-semibold text-secondary hover:underline transition-all relative z-10"
                >
                  {isExpanded ? "Show less" : "Read more"}
                </button>
              )}
            </div>
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
