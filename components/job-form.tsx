'use client'

import React from "react"
import { useState, useTransition } from 'react'
import { createJob, fetchRecruiterflowJob, type JobListing } from '@/app/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Plus,
    Loader2,
    Hash
} from 'lucide-react'
import { toast } from 'sonner'

const JOB_TYPES = [
    { value: 'full-time', label: 'Full-time' },
    { value: 'part-time', label: 'Part-time' },
    { value: 'contract', label: 'Contract' },
    { value: 'freelance', label: 'Freelance' },
    { value: 'internship', label: 'Internship' },
    { value: 'remote', label: 'Remote' },
]

type JobFormProps = {
    onJobAdded: (job: JobListing) => void
}

export function JobForm({ onJobAdded }: JobFormProps) {
    const [isPending, startTransition] = useTransition()
    const [jobId, setJobId] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!jobId.trim()) {
            toast.error('Please enter a Job ID')
            return
        }

        startTransition(async () => {
            // 1. Fetch details from Recruiterflow
            const fetchResult = await fetchRecruiterflowJob(jobId)

            if (!fetchResult.success) {
                toast.error(fetchResult.error)
                return
            }

            const RecruiterflowJob = fetchResult.data

            // 2. Prepare data for our DB
            const rawJobType = RecruiterflowJob.job_type || 'contract'
            const jobTypeString = typeof rawJobType === 'object' ? (rawJobType.name || rawJobType.label || 'contract') : String(rawJobType)

            const jobData = {
                title: RecruiterflowJob.title,
                description: RecruiterflowJob.about_position || RecruiterflowJob.description || '',
                location: RecruiterflowJob.location || 'Remote',
                company: RecruiterflowJob.company?.name || RecruiterflowJob.company || 'Coordinator',
                job_type: jobTypeString.toLowerCase(),
                pipline_id: Number(jobId),
                questions: RecruiterflowJob.application_form || RecruiterflowJob.questions || [],
                // Recruiterflow sometimes has apply_link, otherwise we point to our own page
                apply_link: RecruiterflowJob.apply_link || `https://careers.coordinators.pro/jobs/${jobId}`
            }

            // 3. Create job in our DB
            const createResult = await createJob(jobData)

            if (createResult.success) {
                toast.success('Job listing created successfully')
                onJobAdded(createResult.data)
                setJobId('')

                // Fire n8n webhook to generate AI summary (fire-and-forget)
                // Use jobData directly it has the full description before Supabase strips it
                fetch('https://n8n.unitzero.tech/webhook/job-summary', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id: createResult.data.id,
                        title: jobData.title,
                        description: jobData.description,
                    }),
                }).catch(() => {})
            } else {
                toast.error(createResult.error)
            }
        })
    }

    return (
        <div className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border/50 transition-all hover:shadow-md">
            <div className="px-6 py-5 border-b border-border/50 bg-muted/20">
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center size-10 rounded-full bg-primary/10 text-primary">
                        <Plus className="size-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-foreground tracking-tight">Quick Add Job</h2>
                        <p className="text-sm text-muted-foreground font-medium">
                            Enter the Recruiterflow Job ID to automatically create a listing
                        </p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="p-8">
                <div className="flex flex-col sm:flex-row items-end gap-4">
                    <div className="flex-1 space-y-2 w-full">
                        <Label htmlFor="jobId" className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2 px-1">
                            <Hash className="size-3.5 text-primary" />
                            Recruiterflow Job ID
                        </Label>
                        <Input
                            id="jobId"
                            placeholder="e.g. 102"
                            value={jobId}
                            onChange={(e) => setJobId(e.target.value)}
                            className="h-14 bg-background border-border/80 rounded-2xl text-lg font-medium shadow-sm focus:ring-4 focus:ring-primary/5 transition-all"
                            autoComplete="off"
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={isPending}
                        className="h-14 rounded-2xl px-10 font-bold text-base shadow-lg shadow-primary/20 transition-all active:scale-[0.98] w-full sm:w-auto"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="size-5 animate-spin mr-2" />
                                Creating...
                            </>
                        ) : (
                            <>
                                <Plus className="size-5 mr-2" />
                                Add Job
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    )
}
