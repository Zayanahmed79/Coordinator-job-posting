'use client'

import { useCallback, useState, useTransition } from 'react'
import useSWR from 'swr'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { getJobs, logout, type JobListing } from '@/app/actions'
import { JobForm } from '@/components/job-form'
import { JobTable } from '@/components/job-table'
import { Toaster, toast } from 'sonner'
import { Loader2, LogOut, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useDebounce } from '@/hooks/use-debounce'

const fetcher = async ([, page, search]: [string, number, string]) => {
    const result = await getJobs(page, 100, search)
    if (!result.success) throw new Error(result.error)
    return result.data
}

export default function DashboardPage() {
    const [currentPage, setCurrentPage] = useState(1)
    const [searchQuery, setSearchQuery] = useState('')
    const debouncedSearch = useDebounce(searchQuery, 500)
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const { data, error, isLoading, mutate } = useSWR(
        ['jobs', currentPage, debouncedSearch],
        fetcher,
        {
            revalidateOnFocus: false,
            keepPreviousData: true,
            dedupingInterval: 5000,
        }
    )

    const handleJobAdded = useCallback(
        (job: JobListing) => {
            mutate(
                (current) =>
                    current
                        ? {
                            ...current,
                            jobs: [job, ...current.jobs],
                            total: current.total + 1,
                            totalPages: Math.ceil((current.total + 1) / 10),
                        }
                        : undefined,
                { revalidate: false }
            )
        },
        [mutate]
    )

    const handleJobDeleted = useCallback(
        (id: string) => {
            mutate(
                (current) =>
                    current
                        ? {
                            ...current,
                            jobs: current.jobs.filter((j) => j.id !== id),
                            total: current.total - 1,
                            totalPages: Math.ceil((current.total - 1) / 10),
                        }
                        : undefined,
                { revalidate: true }
            )
        },
        [mutate]
    )

    const handlePageChange = useCallback((page: number) => {
        startTransition(() => {
            setCurrentPage(page)
        })
    }, [])

    const handleLogout = async () => {
        await logout()
        router.push('/login')
        toast.success('Logged out')
    }

    return (
        <div className="min-h-screen bg-background">
            <Toaster
                position="top-center"
                richColors
                toastOptions={{
                    className: 'font-sans',
                }}
            />

            <header className="fixed top-0 w-full z-50 bg-background/90 backdrop-blur-xl border-b border-border/40 transition-all duration-300">
                <div className="mx-auto max-w-[1400px] px-6 sm:px-12">
                    <div className="flex items-center justify-between h-24">
                        <div className="flex items-center gap-2">
                            <Image
                                src="/logo.png"
                                alt="coordinators.pro"
                                width={280}
                                height={70}
                                className="h-16 w-auto object-contain drop-shadow-sm"
                                priority
                                unoptimized
                            />
                        </div>

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleLogout}
                            className="text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-full px-4 h-10 transition-all"
                        >
                            <LogOut className="size-4 mr-2" />
                            Sign out
                        </Button>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-[1400px] px-6 sm:px-12 pt-28 pb-20">
                <div className="grid gap-10">
                    <section>
                        <JobForm onJobAdded={handleJobAdded} />
                    </section>

                    <section id="jobs" className="space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <h2 className="text-2xl font-bold tracking-tight">Active Listings</h2>
                                {data && (
                                    <span className="text-sm font-medium text-secondary-foreground bg-secondary px-2.5 py-0.5 rounded-full">
                                        {data.total}
                                    </span>
                                )}
                            </div>

                            <div className="relative w-full sm:w-96">
                                <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground pointer-events-none" />
                                <Input
                                    placeholder="Search jobs..."
                                    className="pl-9 bg-background"
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value)
                                        setCurrentPage(1)
                                    }}
                                />
                            </div>
                        </div>

                        {error ? (
                            <div className="bg-card rounded-2xl p-8 text-center border shadow-sm">
                                <p className="text-destructive font-semibold">Failed to load job listings</p>
                                <p className="text-muted-foreground text-sm mt-1">{error.message}</p>
                            </div>
                        ) : isLoading && !data ? (
                            <div className="bg-card rounded-2xl flex flex-col items-center justify-center py-20 border shadow-sm">
                                <Loader2 className="size-8 animate-spin text-muted-foreground mb-3" />
                                <p className="text-sm text-muted-foreground">Loading jobs...</p>
                            </div>
                        ) : data ? (
                            <JobTable
                                jobs={data.jobs}
                                total={data.total}
                                page={data.page}
                                totalPages={data.totalPages}
                                onJobDeleted={handleJobDeleted}
                                onPageChange={handlePageChange}
                                isLoading={isPending}
                            />
                        ) : null}
                    </section>
                </div>
            </main>
        </div>
    )
}
