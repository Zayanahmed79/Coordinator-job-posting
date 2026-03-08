'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, Briefcase, Share2, Facebook, Linkedin, ArrowRight, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { JobListing } from '@/app/actions'
import { DynamicJobForm } from '@/components/dynamic-job-form'

export default function JobDetailPage() {
    const params = useParams()
    const id = params.id as string
    const [job, setJob] = useState<JobListing | null>(null)
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)

    useEffect(() => {
        async function fetchJob() {
            setLoading(true)
            const isNumeric = /^\d+$/.test(id)

            let query = supabase.from('job_listings').select('*')

            if (isNumeric) {
                query = query.eq('pipline_id', Number(id))
            } else {
                query = query.eq('id', id)
            }

            const { data, error } = await query.single()

            if (!error && data) {
                setJob(data)
            } else if (error) {
                console.error('Supabase fetch error:', error)
            }
            setLoading(false)
        }
        fetchJob()
    }, [id])

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="size-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!job) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
                <h1 className="text-2xl font-bold mb-4">Job Not Found</h1>
                <Button onClick={() => window.history.back()}>Go Back</Button>
            </div>
        )
    }

    // Reliable HTML Decoding helper for client-side
    const decodeHTML = (html: string) => {
        if (typeof document === 'undefined') return html
        const txt = document.createElement('textarea')
        txt.innerHTML = html
        // Handle double encoding if necessary
        const decoded = txt.value
        if (decoded.includes('&lt;') || decoded.includes('&gt;')) {
            txt.innerHTML = decoded
            return txt.value
        }
        return decoded
    }

    const descriptionHtml = job.description ? decodeHTML(job.description) : ''

    return (
        <div className="min-h-screen bg-[#F5F0EB] text-[#1E2A4A] font-sans">
            {/* Pass isLight={false} to keep navbar text white/light on the dark header */}
            <Navbar isLight={false} />

            {/* Header / Hero Section - DARK BLUE */}
            <div className="bg-[#1E3A5F] pt-40 pb-20">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
                        <div className="space-y-6 max-w-2xl">
                            <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
                                {job.title}
                            </h1>

                            <div className="flex flex-col gap-6">
                                <div>
                                    <span className="bg-[#F47521] text-white px-5 py-2 rounded-lg text-[13px] font-bold uppercase tracking-widest shadow-lg shadow-orange-500/20">
                                        {job.job_type || 'Contract'}
                                    </span>
                                </div>

                                <div className="flex flex-wrap items-center gap-x-10 gap-y-4">
                                    <div className="flex items-center gap-3 text-white/80 font-bold text-lg">
                                        <MapPin className="size-5 text-[#F47521]" />
                                        {job.location || 'Remote'}
                                    </div>
                                    {job.experience && (
                                        <div className="flex items-center gap-3 text-white/80 font-bold text-lg">
                                            <Briefcase className="size-5 text-[#F47521]" />
                                            {job.experience}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-8 min-w-[240px]">
                            <Button
                                className="bg-[#F47521] hover:bg-[#D9661D] text-white rounded-xl h-14 px-10 text-lg font-bold transition-all shadow-xl shadow-orange-500/25 group border-0 active:scale-95"
                                onClick={() => {
                                    const formElement = document.getElementById('apply-section')
                                    formElement?.scrollIntoView({ behavior: 'smooth' })
                                }}
                            >
                                Apply To Job <ArrowRight className="ml-3 size-5 group-hover:translate-x-1.5 transition-transform" />
                            </Button>

                            <div className="space-y-4">
                                <p className="text-[11px] font-black text-white/30 uppercase tracking-[0.3em] pl-1">Share Opportunity</p>
                                <div className="flex items-center gap-6">
                                    <button
                                        className="text-white/40 hover:text-white transition-all hover:scale-110"
                                        onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank')}
                                    >
                                        <Linkedin className="size-6" />
                                    </button>
                                    <button
                                        className="text-white/40 hover:text-white transition-all hover:scale-110"
                                        onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
                                    >
                                        <Facebook className="size-6" />
                                    </button>
                                    <button
                                        className="text-white/40 hover:text-white transition-all hover:scale-110"
                                        onClick={() => {
                                            if (navigator.share) {
                                                navigator.share({
                                                    title: job.title,
                                                    url: window.location.href
                                                }).catch(() => { })
                                            } else {
                                                navigator.clipboard.writeText(window.location.href)
                                                alert('Link copied to clipboard!')
                                            }
                                        }}
                                    >
                                        <Share2 className="size-6" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section - NO BOXES */}
            <div className="max-w-5xl mx-auto px-4 py-20 md:py-28">
                <div className="grid lg:grid-cols-1">
                    <div className="max-w-none">
                        <style dangerouslySetInnerHTML={{
                            __html: `
                            .description-content h1 { font-size: 2.25rem; font-weight: 800; color: #1E3A5F; margin-top: 2.5rem; margin-bottom: 1.25rem; letter-spacing: -0.025em; }
                            .description-content h2 { font-size: 1.875rem; font-weight: 700; color: #1E3A5F; margin-top: 2rem; margin-bottom: 1rem; letter-spacing: -0.025em; }
                            .description-content h3 { font-size: 1.5rem; font-weight: 700; color: #1E3A5F; margin-top: 1.5rem; margin-bottom: 0.75rem; }
                            .description-content p { font-size: 1.125rem; line-height: 1.8; color: #1A202C; margin-bottom: 1.5rem; }
                            .description-content ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1.5rem; }
                            .description-content ol { list-style-type: decimal; padding-left: 1.5rem; margin-bottom: 1.5rem; }
                            .description-content li { font-size: 1.125rem; line-height: 1.8; color: #1A202C; margin-bottom: 0.5rem; padding-left: 0.5rem; }
                            .description-content strong { color: #1E3A5F; font-weight: 700; }
                            .description-content a { color: #F47521; text-decoration: underline; font-weight: 600; }
                            .description-content br { content: ""; margin-bottom: 1rem; display: block; }
                        `}} />
                        <div
                            className="description-content"
                            dangerouslySetInnerHTML={{ __html: descriptionHtml }}
                        />
                    </div>
                </div>

                {/* Apply Section - UNBOXED */}
                <div id="apply-section" className="mt-24 pt-24 border-t-2 border-[#E0DBD6]/50">
                    <DynamicJobForm job={job} />
                </div>
            </div>
        </div>
    )
}
