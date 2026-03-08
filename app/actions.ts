'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidateTag } from 'next/cache'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

export async function getJobById(id: string): Promise<JobListing | null> {
    const isNumeric = /^\d+$/.test(id)

    let query = supabase.from('job_listings').select('*')

    if (isNumeric) {
        query = query.eq('pipline_id', Number(id))
    } else {
        query = query.eq('id', id)
    }

    const { data, error } = await query.single()

    if (error) {
        console.error('Error fetching job by ID:', error)
        return null
    }

    return data
}

export type JobListing = {
    id: string
    title: string
    description: string | null
    location: string | null
    company: string | null
    apply_link: string | null
    job_type: string
    pipline_id: number | null
    experience: string | null
    created_at: string
    questions?: any[]
}

export type ActionResponse<T = void> =
    | { success: true; data: T }
    | { success: false; error: string }

const VALID_JOB_TYPES = ['full-time', 'part-time', 'contract', 'freelance', 'internship', 'remote']

function sanitizeString(str: string): string {
    return str.replace(/[<>]/g, '').trim()
}

function validateJobInput(data: {
    title?: string
    company?: string
    job_type?: string
    location?: string
    apply_link?: string
    description?: string
}): { valid: true } | { valid: false; error: string } {
    // Basic validation for manual entries, 
    // but allowing empty fields for Quick Add as they come from API
    if (data.title && data.title.length > 200) {
        return { valid: false, error: 'Job title must be less than 200 characters' }
    }
    return { valid: true }
}

export async function createJob(formData: {
    title: string
    company: string
    job_type: string
    location?: string
    apply_link?: string
    pipline_id?: string | number
    description?: string
    questions?: any[]
}): Promise<ActionResponse<JobListing>> {
    const validation = validateJobInput(formData)
    if (!validation.valid) {
        return { success: false, error: validation.error }
    }

    const sanitizedData = {
        title: sanitizeString(formData.title),
        company: formData.company ? sanitizeString(formData.company) : null,
        job_type: formData.job_type.toLowerCase().trim(),
        location: formData.location ? sanitizeString(formData.location) : null,
        apply_link: formData.apply_link ? formData.apply_link.trim() : null,
        pipline_id: formData.pipline_id ? Number(formData.pipline_id) : null,
        description: formData.description ? formData.description.trim() : null,
        questions: formData.questions || [],
    }

    const { data, error } = await supabase
        .from('job_listings')
        .insert([sanitizedData])
        .select()
        .single()

    if (error) {
        console.error('Supabase error:', error)
        return { success: false, error: 'Failed to create job listing. Please try again.' }
    }

    revalidateTag('jobs', 'max')
    return { success: true, data }
}

export async function fetchRecruiterflowJob(jobId: string): Promise<ActionResponse<any>> {
    try {
        const response = await fetch(`https://api.recruiterflow.com/api/external/job?job_id=${jobId}`, {
            headers: {
                'RF-Api-Key': '31292c5fcc5dd07123b80a8fe7cc2616',
                'Accept': 'application/json'
            }
        })

        if (!response.ok) {
            const errorText = await response.text()
            console.error('Recruiterflow API Error:', response.status, errorText)
            return { success: false, error: `Failed to fetch job details (Status: ${response.status}). Please check the Job ID.` }
        }

        const data = await response.json()
        return { success: true, data }
    } catch (error) {
        console.error('Recruiterflow error:', error)
        return { success: false, error: 'Failed to connect to Recruiterflow' }
    }
}

export async function deleteJob(id: string): Promise<ActionResponse> {
    if (!id || typeof id !== 'string' || id.length < 10) {
        return { success: false, error: 'Invalid job ID' }
    }

    const { error } = await supabase
        .from('job_listings')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Supabase error:', error)
        return { success: false, error: 'Failed to delete job listing. Please try again.' }
    }

    revalidateTag('jobs', 'max')
    return { success: true, data: undefined }
}

export async function getJobs(page = 1, limit = 10, search = ''): Promise<ActionResponse<{
    jobs: JobListing[]
    total: number
    page: number
    totalPages: number
}>> {
    const safePage = Math.max(1, Math.floor(page))
    const safeLimit = Math.min(50, Math.max(1, Math.floor(limit)))
    const offset = (safePage - 1) * safeLimit

    let query = supabase.from('job_listings').select('*', { count: 'exact', head: true })
    let dataQuery = supabase.from('job_listings').select('*').order('created_at', { ascending: false })

    if (search) {
        const searchFilter = `title.ilike.%${search}%,company.ilike.%${search}%,description.ilike.%${search}%`
        query = query.or(searchFilter)
        dataQuery = dataQuery.or(searchFilter)
    }

    const [countResult, dataResult] = await Promise.all([
        query,
        dataQuery.range(offset, offset + safeLimit - 1)
    ])

    if (countResult.error) {
        console.error('Supabase count error:', countResult.error)
        return { success: false, error: 'Failed to fetch job count' }
    }

    if (dataResult.error) {
        console.error('Supabase error:', dataResult.error)
        return { success: false, error: 'Failed to fetch job listings' }
    }

    const total = countResult.count || 0
    const totalPages = Math.ceil(total / safeLimit)

    return {
        success: true,
        data: {
            jobs: dataResult.data || [],
            total,
            page: safePage,
            totalPages,
        },
    }
}

export async function login(email: string, pass: string): Promise<ActionResponse> {
    const adminEmail = process.env.ADMIN_EMAIL
    const adminPass = process.env.ADMIN_PASSWORD

    if (!adminEmail || !adminPass) {
        console.error('Missing ADMIN_EMAIL or ADMIN_PASSWORD env vars')
        return { success: false, error: 'Configuration Error: Admin credentials are not set.' }
    }

    if (email === adminEmail && pass === adminPass) {
        const cookieStore = await cookies()
        cookieStore.set('auth_token', 'valid_session', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/',
        })
        return { success: true, data: undefined }
    }

    return { success: false, error: 'Invalid credentials' }
}

export async function logout(): Promise<ActionResponse> {
    const cookieStore = await cookies()
    cookieStore.delete('auth_token')
    return { success: true, data: undefined }
}
