import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const formData = await request.formData()
        const file = formData.get('pdf') as File
        const jobId = formData.get('jobId') as string
        const jobTitle = formData.get('jobTitle') as string

        if (!file) {
            return NextResponse.json(
                { error: 'Resume PDF is required' },
                { status: 400 }
            )
        }

        // 1. Extract resume details
        const extractFormData = new FormData()
        extractFormData.append('file', file)

        const extractRes = await fetch('https://unitzero-4fi4q.ondigitalocean.app/api/resume/extract', {
            method: 'POST',
            body: extractFormData,
        })

        if (!extractRes.ok) {
            const errorText = await extractRes.text()
            console.error('Extraction error:', errorText)
            return NextResponse.json(
                { error: 'Failed to extract details from resume. Please try again.' },
                { status: extractRes.status }
            )
        }

        const extractedData = await extractRes.json()

        // 2. Post to webhook
        const webhookPayload = {
            ...extractedData,
            job_id: jobId,
            job_title: jobTitle,
            source: 'Job Board Application',
            timestamp: new Date().toISOString(),
        }

        const webhookRes = await fetch('https://n8n.unitzero.tech/webhook/d6980632-db9d-4174-9d8d-efe53a39c98e', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(webhookPayload),
        })

        if (!webhookRes.ok) {
            console.error('Webhook error:', await webhookRes.text())
            return NextResponse.json(
                { error: 'Failed to submit application to our system. Please try again.' },
                { status: webhookRes.status }
            )
        }

        return NextResponse.json({ success: true, data: extractedData })
    } catch (error) {
        console.error('Apply error:', error)
        return NextResponse.json(
            { error: 'An unexpected error occurred while processing your application.' },
            { status: 500 }
        )
    }
}
