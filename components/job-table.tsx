'use client'

import { useState, useTransition, useMemo, useCallback } from 'react'
import { deleteJob, type JobListing } from '@/app/actions'
import { Button } from '@/components/ui/button'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
    Trash2,
    ExternalLink,
    ChevronLeft,
    ChevronRight,
    Loader2,
    MapPin,
    FileText,
} from 'lucide-react'
import { toast } from 'sonner'

type JobTableProps = {
    jobs: JobListing[]
    total: number
    page: number
    totalPages: number
    onJobDeleted: (id: string) => void
    onPageChange: (page: number) => void
    isLoading?: boolean
}

function formatDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    })
}

export function JobTable({
    jobs,
    total,
    page,
    totalPages,
    onJobDeleted,
    onPageChange,
    isLoading,
}: JobTableProps) {
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const [expandedDescriptions, setExpandedDescriptions] = useState<Set<string>>(new Set())
    const [isPending, startTransition] = useTransition()

    const toggleDescription = useCallback((id: string) => {
        setExpandedDescriptions(prev => {
            const next = new Set(prev)
            if (next.has(id)) {
                next.delete(id)
            } else {
                next.add(id)
            }
            return next
        })
    }, [])

    const handleDelete = () => {
        if (!deleteId) return

        startTransition(async () => {
            const result = await deleteJob(deleteId)

            if (result.success) {
                toast.success('Job listing deleted')
                onJobDeleted(deleteId)
            } else {
                toast.error(result.error)
            }

            setDeleteId(null)
        })
    }

    const paginationNumbers = useMemo(() => {
        const pages: number[] = []
        const maxVisible = 5

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) pages.push(i)
        } else if (page <= 3) {
            for (let i = 1; i <= maxVisible; i++) pages.push(i)
        } else if (page >= totalPages - 2) {
            for (let i = totalPages - maxVisible + 1; i <= totalPages; i++) pages.push(i)
        } else {
            for (let i = page - 2; i <= page + 2; i++) pages.push(i)
        }

        return pages
    }, [page, totalPages])

    const startItem = (page - 1) * 10 + 1

    return (
        <div>
            <p className="text-sm text-muted-foreground mb-4">
                Showing {total === 0 ? 0 : startItem} - {Math.min(page * 10, total)} of {total} {total === 1 ? 'job' : 'jobs'}
            </p>

            {jobs.length === 0 && !isLoading ? (
                <div className="bg-card rounded-2xl p-12 text-center">
                    <div className="size-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                        <FileText className="size-7 text-muted-foreground" />
                    </div>
                    <p className="text-foreground font-semibold text-lg">No job listings yet</p>
                    <p className="text-muted-foreground text-sm mt-2">
                        Add your first job listing using the form above
                    </p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {isLoading ? (
                            <div className="col-span-full bg-card rounded-2xl flex items-center justify-center py-20">
                                <Loader2 className="size-8 animate-spin text-muted-foreground" />
                            </div>
                        ) : (
                            jobs.map((job) => {
                                const isExpanded = expandedDescriptions.has(job.id)

                                return (
                                    <div
                                        key={job.id}
                                        className="group bg-card rounded-2xl p-6 shadow-sm border border-border/50 hover:shadow-md transition-all flex flex-col"
                                    >
                                        <div className="flex items-start justify-between gap-4 mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center justify-center size-10 rounded-full bg-secondary shrink-0">
                                                    <FileText className="size-5 text-muted-foreground" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-foreground text-lg leading-tight line-clamp-1" title={job.title}>
                                                        {job.title}
                                                    </h3>
                                                    <p className="text-secondary font-semibold text-sm mt-0.5 line-clamp-1">
                                                        {job.company}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 shrink-0">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 px-2 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors text-xs font-bold"
                                                    asChild
                                                >
                                                    <a href={`/jobs/${job.pipline_id || job.id}`} target="_blank" rel="noopener noreferrer">
                                                        <ExternalLink className="size-3.5 mr-1" />
                                                        View
                                                    </a>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                                                    onClick={() => setDeleteId(job.id)}
                                                    title="Delete listing"
                                                >
                                                    <Trash2 className="size-4" />
                                                    <span className="sr-only">Delete</span>
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
                                            {job.location && (
                                                <span className="flex items-center gap-1.5 bg-background px-2.5 py-1 rounded-md border border-border/50">
                                                    <MapPin className="size-3.5" />
                                                    {job.location}
                                                </span>
                                            )}
                                            <span className="bg-background px-2.5 py-1 rounded-md border border-border/50">
                                                {formatDate(job.created_at)}
                                            </span>
                                            {job.pipline_id && (
                                                <span className="flex items-center gap-1.5 bg-primary/10 text-primary px-2.5 py-1 rounded-md border border-primary/20 font-bold">
                                                    ID: {job.pipline_id}
                                                </span>
                                            )}
                                        </div>

                                        {job.description && (
                                            <div className="flex-1">
                                                <p className={`text-sm text-muted-foreground leading-relaxed ${!isExpanded ? 'line-clamp-3' : ''}`}>
                                                    {job.description.replace(/<[^>]*>/g, ' ')}
                                                </p>
                                                {job.description.replace(/<[^>]*>/g, ' ').length > 150 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleDescription(job.id)}
                                                        className="inline-flex items-center gap-1 text-xs font-semibold text-secondary hover:text-secondary/80 mt-2 transition-colors underline-offset-4 hover:underline"
                                                    >
                                                        {isExpanded ? 'Show less' : 'Read more'}
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )
                            })
                        )}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-1 mt-8">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onPageChange(page - 1)}
                                disabled={page === 1 || isLoading}
                                className="h-10 w-10 p-0 rounded-full"
                            >
                                <ChevronLeft className="size-4" />
                                <span className="sr-only">Previous</span>
                            </Button>

                            {paginationNumbers.map((pageNum) => (
                                <Button
                                    key={pageNum}
                                    variant={pageNum === page ? 'default' : 'ghost'}
                                    size="sm"
                                    onClick={() => onPageChange(pageNum)}
                                    disabled={isLoading}
                                    className="h-10 w-10 p-0 rounded-full font-medium"
                                >
                                    {pageNum}
                                </Button>
                            ))}

                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onPageChange(page + 1)}
                                disabled={page === totalPages || isLoading}
                                className="h-10 w-10 p-0 rounded-full"
                            >
                                <ChevronRight className="size-4" />
                                <span className="sr-only">Next</span>
                            </Button>
                        </div>
                    )}
                </>
            )}

            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent className="rounded-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete this job listing?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. The job listing will be permanently removed.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isPending} className="rounded-full">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={isPending}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-full"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="size-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                'Delete'
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
