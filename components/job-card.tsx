"use client"

import { useState, useRef } from "react"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "./ui/alert-dialog"
import { supabase } from "../lib/supabase"
import type { ResumeExtracted } from "../lib/resume-types"
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

  const [showDialog, setShowDialog] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [thankYou, setThankYou] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
  }

  async function handleResumeUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setUploading(true);
    setError(null);
    const file = selectedFile;
    if (!file) {
      setError("Please select a PDF file.");
      setUploading(false);
      return;
    }
    const formData = new FormData();
    formData.append("pdf", file);
    try {
      const res = await fetch("/api/resume", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to extract resume.");
      const data: ResumeExtracted = await res.json();
      // Print resume details to console
      console.log("Extracted Resume:", data);
      // Save to Supabase (candidate table)
      await supabase.from("candidate").insert([
        {
          ...data,
        },
      ]);
      setThankYou(true);
    } catch (err: any) {
      setError(err.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
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
        {/* Apply Now & Resume Upload */}
        <div className="flex flex-wrap items-center gap-4 pt-3 mt-auto border-t border-border/50">
          <AlertDialog
            open={showDialog}
            onOpenChange={(open) => {
              setShowDialog(open);
              if (!open) {
                setThankYou(false);
                setSelectedFile(null);
                setError(null);
              }
            }}
          >
            <AlertDialogTrigger asChild>
              <button
                className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground text-sm font-bold rounded-full hover:bg-primary/90 hover:shadow-lg active:scale-[0.98] transition-all whitespace-nowrap"
                onClick={() => setShowDialog(true)}
              >
                Apply Now
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Upload Your Resume</AlertDialogTitle>
                <AlertDialogDescription>
                  <span className="block mb-2">Please upload your resume in PDF format.</span>
                  <span className="block text-xs text-muted-foreground mb-2">We will extract your details and save them securely.</span>
                </AlertDialogDescription>
              </AlertDialogHeader>
              {thankYou ? (
                <>
                  <button
                    className="absolute top-4 right-4 text-2xl text-red-500 bg-transparent border-none cursor-pointer"
                    aria-label="Close"
                    style={{ zIndex: 10 }}
                    onClick={() => setShowDialog(false)}
                  >
                    ✖
                  </button>
                  <div className="py-6 flex flex-col items-center">
                    <span className="text-green-600 text-2xl mb-2">✅</span>
                    <div className="font-semibold text-green-700 mt-2">Thank you! Your resume has been uploaded.</div>
                      <button
                        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg font-bold shadow hover:bg-blue-700 transition"
                        onClick={() => window.open('https://josh-virid.vercel.app/record/14uooko4', '_blank')}
                      >
                        Record Video
                      </button>
                  </div>
                </>
              ) : (
                <form onSubmit={handleResumeUpload} className="flex flex-col gap-4">
                  <label htmlFor="resume-upload" className="flex flex-col items-center justify-center border-2 border-dashed border-primary/40 rounded-lg p-6 cursor-pointer hover:border-primary transition">
                    <span className="text-4xl mb-2">📄</span>
                    <span className="font-medium mb-1">Choose PDF file</span>
                    <input
                      id="resume-upload"
                      type="file"
                      accept="application/pdf"
                      ref={fileInputRef}
                      className="hidden"
                      required
                      onChange={handleFileChange}
                    />
                    <span className="text-xs text-muted-foreground mt-2">Only PDF files are supported</span>
                  </label>
                  {/* Show selected file name */}
                  {selectedFile && (
                    <div className="text-sm text-primary font-semibold text-center">{selectedFile.name}</div>
                  )}
                  {error && <div className="text-red-600 text-sm text-center">{error}</div>}
                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={uploading}>Cancel</AlertDialogCancel>
                    <button
                      type="submit"
                      className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-bold shadow hover:bg-primary/90 transition"
                      disabled={uploading}
                    >
                      {uploading ? "Uploading..." : "Upload Resume"}
                    </button>
                  </AlertDialogFooter>
                </form>
              )}
            </AlertDialogContent>
          </AlertDialog>
          <a
            href={job.apply_link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:gap-3 transition-all whitespace-nowrap"
          >
            View Details <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  )
}
