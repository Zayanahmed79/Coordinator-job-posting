'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { login } from '@/app/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Toaster, toast } from 'sonner'
import Image from 'next/image'
import { Loader2, Lock, Mail } from 'lucide-react'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        startTransition(async () => {
            const result = await login(email, password)
            if (result.success) {
                router.push('/dashboard')
            } else {
                toast.error(result.error)
            }
        })
    }

    return (
        <div className="min-h-screen grid place-items-center bg-gray-50/50 relative overflow-hidden">
            {/* Background gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-primary/5 blur-3xl opacity-50" />
                <div className="absolute top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-blue-500/5 blur-3xl opacity-50" />
            </div>

            <Toaster position="top-center" richColors />

            <div className="w-full max-w-md p-8 sm:p-10 bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl">
                <div className="flex flex-col items-center gap-6 text-center mb-8">
                    <Image
                        src="/logo.png"
                        alt="coordinators.pro"
                        width={240}
                        height={60}
                        className="h-16 w-auto object-contain"
                        priority
                        unoptimized
                    />
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Welcome back</h1>
                        <p className="text-sm text-gray-500">
                            Sign in to manage your job listings
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-2.5 size-4 text-gray-400" />
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="pl-10 h-10 bg-white border-gray-200 focus:border-primary focus:ring-primary/20 transition-all rounded-xl"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password">Password</Label>
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-2.5 size-4 text-gray-400" />
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="pl-10 h-10 bg-white border-gray-200 focus:border-primary focus:ring-primary/20 transition-all rounded-xl"
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full h-11 rounded-xl text-base font-medium shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30"
                        disabled={isPending}
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 size-4 animate-spin" />
                                Validating...
                            </>
                        ) : (
                            'Sign in to Dashboard'
                        )}
                    </Button>
                </form>
            </div>
        </div>
    )
}
