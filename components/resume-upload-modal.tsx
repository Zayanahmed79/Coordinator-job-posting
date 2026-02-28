"use client"

import { useState, useRef } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2, UploadCloud, FileText, X } from "lucide-react"

interface ResumeUploadModalProps {
  isOpen: boolean
  onClose: () => void
  jobId?: string
  jobTitle?: string
}

export function ResumeUploadModal({ isOpen, onClose, jobId, jobTitle }: ResumeUploadModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = (selectedFile: File) => {
    if (selectedFile.type !== "application/pdf" && !selectedFile.name.endsWith('.docx')) {
      setError("Only PDF and DOCX files are allowed")
      return
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB")
      return
    }
    setFile(selectedFile)
    setError(null)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const removeFile = () => {
    setFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      setError("Please select a resume file")
      return
    }

    setIsUploading(true)
    setError(null)
    setSuccess(false)

    try {
      const formData = new FormData()
      formData.append("pdf", file)
      if (jobId) formData.append("jobId", jobId)
      if (jobTitle) formData.append("jobTitle", jobTitle)

      const res = await fetch("/api/apply", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || "Failed to submit application. Please try again.")
      }

      setSuccess(true)
      setTimeout(() => {
        onClose()
        setTimeout(() => {
          setFile(null)
          setSuccess(false)
        }, 300)
      }, 2000)

    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-[#FAF6F0] border-0 text-[#202D4E] p-8">
        <DialogHeader className="mb-2">
          <DialogTitle className="text-2xl font-bold text-[#1e293b]">Upload your resume</DialogTitle>
          <DialogDescription className="text-base text-slate-500">
            Help us get to know you better by sharing your resume.
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-2">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-green-600">Application Submitted!</h3>
            <p className="text-sm text-muted-foreground">Your resume has been successfully processed.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {!file ? (
              <div
                className={`border border-dashed rounded-lg py-12 px-6 flex flex-col items-center justify-center text-center transition-colors cursor-pointer ${isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-muted/30'
                  }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="mb-4 text-muted-foreground">
                  <UploadCloud className="w-10 h-10" strokeWidth={1.5} />
                </div>
                <div className="text-sm font-medium mb-1">
                  Drag your resume here or click to upload
                </div>
                <div className="text-xs text-muted-foreground">
                  Acceptable file types: PDF, DOCX (5MB max)
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="border border-slate-200 rounded-2xl p-4 flex items-center gap-4 bg-white/60">
                <div className="w-14 h-14 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                  <FileText className="w-7 h-7 text-[#F97316]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-semibold text-slate-800 truncate">{file.name}</p>
                  <p className="text-[13px] text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <button
                  type="button"
                  onClick={removeFile}
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors shrink-0"
                  disabled={isUploading}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            {error && (
              <div className="text-[15px] text-red-500 p-4 bg-red-50 rounded-xl font-medium">
                {error}
              </div>
            )}

            {file && (
              <div className="flex justify-end gap-3 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isUploading}
                  className="px-6 py-2.5 h-auto text-[15px] font-medium rounded-xl border-slate-300 bg-transparent hover:bg-slate-100 text-slate-700"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!file || isUploading}
                  className="px-6 py-2.5 h-auto text-[15px] font-medium rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white border-0 shadow-sm transition-all"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    "Submit"
                  )}
                </Button>
              </div>
            )}
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
