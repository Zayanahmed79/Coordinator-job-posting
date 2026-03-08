import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const formData = await request.formData()

        const jobId = formData.get('jobId') as string
        const jobTitle = formData.get('jobTitle') as string
        const firstName = formData.get('firstName') as string
        const lastName = formData.get('lastName') as string
        const email = formData.get('email') as string
        const phone = formData.get('phone') as string
        const videoLink = formData.get('videoLink') as string
        const linkedin = formData.get('linkedin') as string
        const locationStr = formData.get('location') as string
        const answersStr = formData.get('answers') as string
        const experiencesStr = formData.get('experiences') as string

        const location = locationStr ? JSON.parse(locationStr) : {}
        const answers = answersStr ? JSON.parse(answersStr) : {}
        const experiences = experiencesStr ? JSON.parse(experiencesStr) : []

        // 1. Post to webhook
        const webhookPayload = {
            job_id: jobId,
            job_title: jobTitle,
            first_name: firstName,
            last_name: lastName,
            full_name: `${firstName} ${lastName}`,
            email: email,
            phone: phone,
            video_recording_link: videoLink,
            linkedin_profile: linkedin,
            location: location,
            additional_answers: answers,
            experiences: experiences,
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

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Apply error:', error)
        return NextResponse.json(
            { error: 'An unexpected error occurred while processing your application.' },
            { status: 500 }
        )
    }
}
