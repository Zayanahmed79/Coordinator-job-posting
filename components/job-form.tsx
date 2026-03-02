'use client'

import React from "react"
import { useState, useTransition } from 'react'
import { createJob, type JobListing } from '@/app/actions'
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
    Briefcase,
    Building2,
    MapPin,
    FileText,
    Clock,
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
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        company: '',
        job_type: '',
        job_id: '',
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.title.trim() || !formData.job_type) {
            toast.error('Please fill in all required fields')
            return
        }

        startTransition(async () => {
            const result = await createJob(formData)

            if (result.success) {
                toast.success('Job listing created successfully')
                onJobAdded(result.data)
                setFormData({
                    title: '',
                    description: '',
                    location: '',
                    company: '',
                    job_type: '',
                    job_id: '',
                })
            } else {
                toast.error(result.error)
            }
        })
    }

    const updateField = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    return (
        <div className="bg-card rounded-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-border/50">
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center size-10 rounded-full bg-primary/10 text-primary">
                        <Plus className="size-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-foreground">Add New Job</h2>
                        <p className="text-sm text-muted-foreground">
                            Fill in the details to create a new listing
                        </p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
                <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-sm font-medium flex items-center gap-2">
                            <Briefcase className="size-3.5 text-muted-foreground" />
                            Job Title <span className="text-primary">*</span>
                        </Label>
                        <Input
                            id="title"
                            placeholder="e.g. Senior Software Engineer"
                            value={formData.title}
                            onChange={(e) => updateField('title', e.target.value)}
                            className="h-11 bg-background border-border/50 rounded-xl"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="company" className="text-sm font-medium flex items-center gap-2">
                            <Building2 className="size-3.5 text-muted-foreground" />
                            Company
                        </Label>
                        <Input
                            id="company"
                            placeholder="e.g. Acme Inc."
                            value={formData.company}
                            onChange={(e) => updateField('company', e.target.value)}
                            className="h-11 bg-background border-border/50 rounded-xl"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="location" className="text-sm font-medium flex items-center gap-2">
                            <MapPin className="size-3.5 text-muted-foreground" />
                            Location
                        </Label>
                        <Input
                            id="location"
                            placeholder="e.g. San Francisco, CA or Remote"
                            value={formData.location}
                            onChange={(e) => updateField('location', e.target.value)}
                            className="h-11 bg-background border-border/50 rounded-xl"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="job_type" className="text-sm font-medium flex items-center gap-2">
                            <Clock className="size-3.5 text-muted-foreground" />
                            Job Type <span className="text-primary">*</span>
                        </Label>
                        <Select
                            value={formData.job_type}
                            onValueChange={(value) => updateField('job_type', value)}
                        >
                            <SelectTrigger className="h-11 w-full bg-background border-border/50 rounded-xl">
                                <SelectValue placeholder="Select job type" />
                            </SelectTrigger>
                            <SelectContent>
                                {JOB_TYPES.map((type) => (
                                    <SelectItem key={type.value} value={type.value}>
                                        {type.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="job_id" className="text-sm font-medium flex items-center gap-2">
                            <Hash className="size-3.5 text-muted-foreground" />
                            Job ID
                        </Label>
                        <Input
                            id="job_id"
                            type="number"
                            placeholder="e.g. 123456"
                            value={formData.job_id}
                            onChange={(e) => updateField('job_id', e.target.value)}
                            className="h-11 bg-background border-border/50 rounded-xl"
                        />
                    </div>

                    <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="description" className="text-sm font-medium flex items-center gap-2">
                            <FileText className="size-3.5 text-muted-foreground" />
                            Description
                        </Label>
                        <Textarea
                            id="description"
                            placeholder="Enter job description, requirements, responsibilities..."
                            value={formData.description}
                            onChange={(e) => updateField('description', e.target.value)}
                            className="min-h-28 resize-y bg-background border-border/50 rounded-xl"
                        />
                    </div>
                </div>

                <div className="mt-6 flex items-center justify-between pt-5 border-t border-border/50">
                    <p className="text-xs text-muted-foreground">
                        <span className="text-primary">*</span> Required fields
                    </p>
                    <Button
                        type="submit"
                        disabled={isPending}
                        className="rounded-full px-8 h-11 font-medium"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="size-4 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            <>
                                <Plus className="size-4" />
                                Add Job Listing
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    )
}
