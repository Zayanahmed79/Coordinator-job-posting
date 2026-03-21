'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ChevronDown, ChevronUp, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import type { JobListing } from '@/app/actions'

interface DynamicJobFormProps {
    job: JobListing
}

export function DynamicJobForm({ job }: DynamicJobFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [expandedSections, setExpandedSections] = useState({
        personal: true,
        additional: true
    })

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        city: '',
        state: '',
        country: '',
        zip: '',
        linkedin: '',
        videoLink: '',
    })

    const [experiences, setExperiences] = useState([
        { company: '', title: '', currentlyWorking: false, startDate: '', endDate: '' }
    ])

    const [answers, setAnswers] = useState<Record<string, string>>({})

    const addExperience = () => {
        setExperiences([...experiences, { company: '', title: '', currentlyWorking: false, startDate: '', endDate: '' }])
    }

    const updateExperience = (index: number, field: string, value: any) => {
        const newExps = [...experiences]
        newExps[index] = { ...newExps[index], [field]: value }
        setExperiences(newExps)
    }



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        setIsSubmitting(true)

        try {
            const submitData = new FormData()
            submitData.append('jobId', String(job.pipline_id || job.id))
            submitData.append('jobTitle', job.title)

            // Personal Info
            submitData.append('firstName', formData.firstName)
            submitData.append('lastName', formData.lastName)
            submitData.append('email', formData.email)
            submitData.append('phone', formData.phone)
            submitData.append('videoLink', formData.videoLink)
            submitData.append('linkedin', formData.linkedin)
            submitData.append('location', JSON.stringify({
                city: formData.city,
                state: formData.state,
                country: formData.country,
                zip: formData.zip
            }))

            // Experiences
            submitData.append('experiences', JSON.stringify(experiences))

            // Dynamic Answers
            
            submitData.append('answers', JSON.stringify(answers))

            const response = await fetch('/api/apply', {
                method: 'POST',
                body: submitData
            })

            if (response.ok) {
                toast.success('Application submitted successfully!')
                setIsSubmitted(true)
                window.scrollTo({ top: 0, behavior: 'smooth' })
            } else {
                const err = await response.json()
                toast.error(err.error || 'Failed to submit application')
            }
        } catch (error) {
            toast.error('An unexpected error occurred')
        } finally {
            setIsSubmitting(false)
        }
    }

    const toggleSection = (section: 'personal' | 'additional') => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
    }

    // Helper to determine if a field in application_form is personal_info or candidate_profile
    // We want to filter these out of "Additional Questions" because we handle them separately
    const isStandardField = (q: any) => {
        const key = q.parts?.[0]?.key || ''
        const text = (q.text || q.label || q.question || '').toUpperCase()
        return key.startsWith('personal_info.') || 
               key.startsWith('candidate_profile.resume') || 
               q.type === 'experience' ||
               text.includes('VOCAROO') ||
               text.includes('LOOM') ||
               text.includes('AUDIO OR VIDEO') ||
               text.includes('RECORD A SHORT')
    }

    const additionalQuestions = job.questions?.filter(q => !isStandardField(q)) || []
    const hasExperienceField = job.questions?.some(q => q.type === 'experience')

    if (isSubmitted) {
        return (
            <div className="w-full py-20 flex flex-col items-center text-center space-y-8 animate-in fade-in zoom-in duration-500">
                <div className="size-24 bg-green-100 rounded-full flex items-center justify-center text-green-600 shadow-inner">
                    <svg className="size-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <div className="space-y-4">
                    <h2 className="text-4xl font-extrabold text-[#1E3A5F] tracking-tight">Thank You for Applying!</h2>
                    <p className="text-[#5A6A7A] text-xl leading-relaxed max-w-2xl mx-auto">
                        Your application for the <strong>{job.title}</strong> position has been successfully submitted.
                        Our team will review your profile and get back to you soon.
                    </p>
                </div>
                <Button
                    onClick={() => window.location.href = '/'}
                    className="bg-[#1E3A5F] hover:bg-[#152e4d] text-white px-10 h-14 rounded-xl font-bold text-lg shadow-xl transition-all active:scale-95"
                >
                    Back to Job Board
                </Button>
            </div>
        )
    }

    return (
        <div className="w-full">
            <div className="space-y-12">
                <div className="space-y-4">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-[#1E3A5F] tracking-tight">Apply To Job</h2>
                    <p className="text-[#5A6A7A] text-lg leading-relaxed max-w-2xl">
                        Please fill in your details below to submit your application.
                        A Loom video recording link is required for this application.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-12">
                    {/* ... existing form content ... */}

                    {/* Personal Information */}
                    <div className="bg-white rounded-xl border border-border/50 overflow-hidden shadow-sm">
                        <button
                            type="button"
                            onClick={() => toggleSection('personal')}
                            className="w-full flex items-center justify-between p-5 bg-slate-50 border-b border-border/30 hover:bg-slate-100 transition-colors"
                        >
                            <span className="font-bold text-[#1E3A5F]">Personal Information</span>
                            {expandedSections.personal ? <ChevronUp className="size-5 text-slate-400" /> : <ChevronDown className="size-5 text-slate-400" />}
                        </button>

                        {expandedSections.personal && (
                            <div className="p-6 grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label className="text-slate-600 font-bold text-xs uppercase tracking-wider">Full Name *</Label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input
                                            placeholder="First name"
                                            value={formData.firstName}
                                            onChange={e => setFormData(p => ({ ...p, firstName: e.target.value }))}
                                            className="bg-slate-50/50 border-slate-200 h-10 focus-visible:ring-[#F47521]"
                                            required
                                        />
                                        <Input
                                            placeholder="Last name"
                                            value={formData.lastName}
                                            onChange={e => setFormData(p => ({ ...p, lastName: e.target.value }))}
                                            className="bg-slate-50/50 border-slate-200 h-10 focus-visible:ring-[#F47521]"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-slate-600 font-bold text-xs uppercase tracking-wider">Email *</Label>
                                    <Input
                                        type="email"
                                        placeholder="Email address"
                                        value={formData.email}
                                        onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                                        className="bg-slate-50/50 border-slate-200 h-10 focus-visible:ring-[#F47521]"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-slate-600 font-bold text-xs uppercase tracking-wider">Phone *</Label>
                                    <Input
                                        placeholder="Enter phone number"
                                        value={formData.phone}
                                        onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                                        className="bg-slate-50/50 border-slate-200 h-10 focus-visible:ring-[#F47521]"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-slate-600 font-bold text-xs uppercase tracking-wider">LinkedIn Profile *</Label>
                                    <Input
                                        placeholder="Enter LinkedIn profile URL"
                                        value={formData.linkedin}
                                        onChange={e => setFormData(p => ({ ...p, linkedin: e.target.value }))}
                                        className="bg-slate-50/50 border-slate-200 h-10 focus-visible:ring-[#F47521]"
                                        required
                                    />
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <Label className="text-slate-600 font-bold text-xs uppercase tracking-wider">Location *</Label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input
                                            placeholder="City"
                                            value={formData.city}
                                            onChange={e => setFormData(p => ({ ...p, city: e.target.value }))}
                                            className="bg-slate-50/50 border-slate-200 h-10 focus-visible:ring-[#F47521]"
                                            required
                                        />
                                        <Input
                                            placeholder="State"
                                            value={formData.state}
                                            onChange={e => setFormData(p => ({ ...p, state: e.target.value }))}
                                            className="bg-slate-50/50 border-slate-200 h-10 focus-visible:ring-[#F47521]"
                                            required
                                        />
                                        <Input
                                            placeholder="Country"
                                            value={formData.country}
                                            onChange={e => setFormData(p => ({ ...p, country: e.target.value }))}
                                            className="bg-slate-50/50 border-slate-200 h-10 focus-visible:ring-[#F47521]"
                                            required
                                        />
                                        <Input
                                            placeholder="Zip code"
                                            value={formData.zip}
                                            onChange={e => setFormData(p => ({ ...p, zip: e.target.value }))}
                                            className="bg-slate-50/50 border-slate-200 h-10 focus-visible:ring-[#F47521]"
                                            required
                                        />
                                    </div>
                                </div>


                            </div>
                        )}
                    </div>

                    {/* Candidate Profile / Experience Section */}
                    {hasExperienceField && (
                        <div className="bg-white rounded-xl border border-border/50 overflow-hidden shadow-sm">
                            <div className="w-full flex items-center justify-between p-5 bg-slate-50 border-b border-border/30">
                                <span className="font-bold text-slate-700">Candidate Profile</span>
                                <ChevronUp className="size-5 text-slate-400" />
                            </div>

                            <div className="p-6 space-y-8">
                                {experiences.map((exp, idx) => (
                                    <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 first:pt-0 border-t first:border-0 border-slate-100">
                                        <div className="space-y-2 md:col-span-2 flex items-center justify-between">
                                            <Label className="text-slate-600 font-bold text-xs uppercase tracking-wider">Experience {experiences.length > 1 ? `#${idx + 1}` : ''} *</Label>
                                            {idx > 0 && (
                                                <button
                                                    type="button"
                                                    onClick={() => setExperiences(experiences.filter((_, i) => i !== idx))}
                                                    className="text-xs text-destructive font-bold hover:underline"
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Input
                                                placeholder="Company Name"
                                                value={exp.company}
                                                onChange={e => updateExperience(idx, 'company', e.target.value)}
                                                className="bg-slate-50/50 border-slate-200 h-10"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Input
                                                placeholder="Title"
                                                value={exp.title}
                                                onChange={e => updateExperience(idx, 'title', e.target.value)}
                                                className="bg-slate-50/50 border-slate-200 h-10"
                                                required
                                            />
                                        </div>
                                        <div className="md:col-span-2 flex items-center gap-2 mb-2">
                                            <input
                                                type="checkbox"
                                                id={`current-${idx}`}
                                                checked={exp.currentlyWorking}
                                                onChange={e => updateExperience(idx, 'currentlyWorking', e.target.checked)}
                                                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                            />
                                            <label htmlFor={`current-${idx}`} className="text-sm text-slate-600">I am currently working in this role</label>
                                        </div>
                                        <div className="space-y-2">
                                            <Input
                                                type="date"
                                                placeholder="Start Date"
                                                value={exp.startDate}
                                                onChange={e => updateExperience(idx, 'startDate', e.target.value)}
                                                className="bg-slate-50/50 border-slate-200 h-10"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Input
                                                type="date"
                                                placeholder="End Date"
                                                disabled={exp.currentlyWorking}
                                                value={exp.endDate}
                                                onChange={e => updateExperience(idx, 'endDate', e.target.value)}
                                                className="bg-slate-50/50 border-slate-200 h-10"
                                                required={!exp.currentlyWorking}
                                            />
                                        </div>
                                    </div>
                                ))}

                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={addExperience}
                                    className="w-full border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
                                >
                                    + Add Experience
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Additional Questions */}
                    {additionalQuestions.length > 0 && (
                        <div className="bg-white rounded-xl border border-border/50 overflow-hidden shadow-sm">
                            <button
                                type="button"
                                onClick={() => toggleSection('additional')}
                                className="w-full flex items-center justify-between p-5 bg-slate-50 border-b border-border/30 hover:bg-slate-100 transition-colors"
                            >
                                <span className="font-bold text-slate-700">Additional Questions</span>
                                {expandedSections.additional ? <ChevronUp className="size-5 text-slate-400" /> : <ChevronDown className="size-5 text-slate-400" />}
                            </button>

                            {expandedSections.additional && (
                                <div className="p-6 space-y-6">
                                    {additionalQuestions.map((q: any, i: number) => {
                                        const id = q.id || `q_${i}`
                                        const text = q.text || q.label || q.question
                                        return (
                                            <div key={id} className="space-y-2">
                                                <Label className="text-slate-600 font-bold text-xs uppercase tracking-wider">{text} *</Label>
                                                <Textarea
                                                    placeholder="Enter text here"
                                                    value={answers[id] || ''}
                                                    onChange={e => setAnswers(p => ({ ...p, [id]: e.target.value }))}
                                                    className="bg-slate-50/50 border-slate-200 min-h-[100px]"
                                                    required
                                                />
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    <div className="flex justify-center pt-4">
                        <Button
                            disabled={isSubmitting}
                            className="bg-[#F47521] hover:bg-[#D9661D] text-white px-12 h-12 rounded-lg font-bold min-w-[200px] shadow-lg shadow-orange-500/20"
                        >
                            {isSubmitting ? <><Loader2 className="mr-2 animate-spin size-4" /> Submitting...</> : 'Submit Application'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
