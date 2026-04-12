import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const authToken = request.cookies.get('auth_token')
    const { pathname } = request.nextUrl

    // If user is on /login but already authenticated → go to dashboard
    if (pathname === '/login') {
        if (authToken?.value) {
            return NextResponse.redirect(new URL('/dashboard', request.url))
        }
        return NextResponse.next()
    }

    // Protect /dashboard redirect to /login if not authenticated
    if (pathname.startsWith('/dashboard')) {
        if (!authToken?.value) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    // Only run middleware on /login and /dashboard routes
    matcher: ['/login', '/dashboard/:path*'],
}