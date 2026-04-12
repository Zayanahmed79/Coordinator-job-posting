'use client'

import { useState, useTransition, useMemo, useCallback } from 'react'
import { deleteJob, updateJob, type JobListing } from '@/app/actions'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
    MoreHorizontal, Pencil, ExternalLink, Trash2,
    ChevronLeft, ChevronRight, Loader2, FileText,
    X, Save, Briefcase, Sparkles,
} from 'lucide-react'
import { toast } from 'sonner'
import { htmlToText } from '@/lib/utils'

type JobTableProps = {
    jobs: JobListing[]
    total: number
    page: number
    totalPages: number
    onJobDeleted: (id: string) => void
    onJobUpdated?: (job: JobListing) => void
    onPageChange: (page: number) => void
    isLoading?: boolean
    pendingAiIds?: Set<string>
}

function formatDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function JobTable({
    jobs, total, page, totalPages,
    onJobDeleted, onJobUpdated, onPageChange, isLoading, pendingAiIds,
}: JobTableProps) {
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const [editJob, setEditJob] = useState<JobListing | null>(null)
    const [editSummary, setEditSummary] = useState('')
    const [editDescription, setEditDescription] = useState('')
    const [isPending, startTransition] = useTransition()
    const [isEditPending, startEditTransition] = useTransition()

    const openEdit = useCallback((job: JobListing) => {
        setEditJob(job)
        setEditSummary(job.ai_job_description || '')
        setEditDescription(job.description ? htmlToText(job.description) : '')
    }, [])

    const closeEdit = useCallback(() => setEditJob(null), [])

    const handleEditSave = () => {
        if (!editJob) return
        startEditTransition(async () => {
            const result = await updateJob(editJob.id, {
                description: editDescription,
                ai_job_description: editSummary,
            })
            if (result.success) {
                toast.success('Job updated successfully')
                onJobUpdated?.(result.data)
                setEditJob(null)
            } else {
                toast.error(result.error)
            }
        })
    }

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
                Showing {total === 0 ? 0 : startItem}–{Math.min(page * 10, total)} of {total} {total === 1 ? 'job' : 'jobs'}
            </p>

            {jobs.length === 0 && !isLoading ? (
                <div className="bg-card rounded-2xl p-12 text-center border border-border/50">
                    <div className="size-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                        <FileText className="size-7 text-muted-foreground" />
                    </div>
                    <p className="text-foreground font-semibold text-lg">No job listings yet</p>
                    <p className="text-muted-foreground text-sm mt-2">Add your first job listing using the form above</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {isLoading ? (
                            <div className="col-span-full bg-card rounded-2xl flex items-center justify-center py-20 border border-border/50">
                                <Loader2 className="size-8 animate-spin text-muted-foreground" />
                            </div>
                        ) : (
                            jobs.map((job) => {
                                const plainDescription = job.description ? htmlToText(job.description) : ''
                                const isPendingAi = pendingAiIds?.has(job.id)

                                return (
                                    <div
                                        key={job.id}
                                        className="group bg-card rounded-2xl p-6 shadow-sm border border-border/50 hover:shadow-md hover:border-border transition-all flex flex-col gap-3"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="flex items-center justify-center size-10 rounded-xl bg-primary/10 shrink-0">
                                                    <Briefcase className="size-5 text-primary/70" />
                                                </div>
                                                <div className="min-w-0">
                                                    <h3 className="font-semibold text-foreground text-base leading-snug line-clamp-1" title={job.title}>
                                                        {job.title}
                                                    </h3>
                                                    <p className="text-sm text-muted-foreground truncate">{job.company?.split(' - ').pop() || '—'}</p>
                                                </div>
                                            </div>

                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-8 p-0 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted shrink-0"
                                                    >
                                                        <MoreHorizontal className="size-4" />
                                                        <span className="sr-only">Actions</span>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-44 rounded-xl shadow-lg">
                                                    <DropdownMenuItem className="gap-2.5 cursor-pointer rounded-lg py-2" onClick={() => openEdit(job)}>
                                                        <Pencil className="size-4" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="gap-2.5 cursor-pointer rounded-lg py-2" asChild>
                                                        <a href={`/jobs/${job.pipline_id || job.id}`} target="_blank" rel="noopener noreferrer">
                                                            <ExternalLink className="size-4" />
                                                            View
                                                        </a>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem variant="destructive" className="gap-2.5 cursor-pointer rounded-lg py-2" onClick={() => setDeleteId(job.id)}>
                                                        <Trash2 className="size-4" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>

                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-md">
                                                {formatDate(job.created_at)}
                                            </span>
                                        </div>

                                        {isPendingAi ? (
                                            <div className="space-y-2 mt-1">
                                                <div className="h-3.5 bg-muted rounded-full animate-pulse w-full" />
                                                <div className="h-3.5 bg-muted rounded-full animate-pulse w-4/5" />
                                                <p className="text-xs text-muted-foreground/60 mt-2 flex items-center gap-1.5">
                                                    <Sparkles className="size-3 animate-pulse text-primary/50" />
                                                    Generating AI summary...
                                                </p>
                                            </div>
                                        ) : job.ai_job_description ? (
                                            <p className="text-sm text-foreground/80 leading-relaxed line-clamp-2">{job.ai_job_description}</p>
                                        ) : null}
                                    </div>
                                )
                            })
                        )}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-1 mt-8">
                            <Button variant="ghost" size="sm" onClick={() => onPageChange(page - 1)} disabled={page === 1 || isLoading} className="h-10 w-10 p-0 rounded-full">
                                <ChevronLeft className="size-4" />
                            </Button>
                            {paginationNumbers.map((pageNum) => (
                                <Button key={pageNum} variant={pageNum === page ? 'default' : 'ghost'} size="sm" onClick={() => onPageChange(pageNum)} disabled={isLoading} className="h-10 w-10 p-0 rounded-full font-medium">
                                    {pageNum}
                                </Button>
                            ))}
                            <Button variant="ghost" size="sm" onClick={() => onPageChange(page + 1)} disabled={page === totalPages || isLoading} className="h-10 w-10 p-0 rounded-full">
                                <ChevronRight className="size-4" />
                            </Button>
                        </div>
                    )}
                </>
            )}

            {/* ── Edit slide-over panel ── */}
            {editJob && (
                <div className="fixed inset-0 z-50 flex">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeEdit} />
                    <div className="relative ml-auto h-full w-full max-w-2xl bg-background shadow-2xl flex flex-col">

                        {/* Header */}
                        <div className="flex items-center justify-between px-8 py-6 border-b border-border">
                            <div className="min-w-0 pr-4">
                                <h2 className="text-xl font-bold text-foreground">Edit Job Listing</h2>
                                <p className="text-sm text-muted-foreground mt-0.5 truncate">{editJob.title}</p>
                            </div>
                            <Button variant="ghost" size="sm" onClick={closeEdit} className="h-9 w-9 p-0 rounded-full shrink-0">
                                <X className="size-5" />
                            </Button>
                        </div>

                        {/* Fields */}
                        <div className="flex-1 overflow-y-auto px-8 py-7 space-y-7">

                            <div className="space-y-2.5">
                                <Label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                    <Sparkles className="size-3.5 text-primary" />
                                    AI Summary
                                </Label>
                                <Textarea
                                    rows={3}
                                    placeholder="One clean sentence describing the role..."
                                    value={editSummary}
                                    onChange={(e) => setEditSummary(e.target.value)}
                                    className="resize-none rounded-xl text-sm leading-relaxed"
                                />
                                <p className="text-xs text-muted-foreground">Shown on the public job card. One sentence only.</p>
                            </div>

                            <div className="space-y-2.5">
                                <Label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                    <FileText className="size-3.5 text-primary" />
                                    Full Description
                                </Label>
                                <Textarea
                                    rows={18}
                                    placeholder="Full job description..."
                                    value={editDescription}
                                    onChange={(e) => setEditDescription(e.target.value)}
                                    className="resize-y rounded-xl text-sm leading-relaxed"
                                />
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-8 py-5 border-t border-border bg-muted/30 flex items-center justify-between gap-4">
                            <p className="text-xs text-muted-foreground">Saves directly to the database.</p>
                            <div className="flex items-center gap-3">
                                <Button variant="outline" onClick={closeEdit} disabled={isEditPending} className="rounded-full px-6">
                                    Cancel
                                </Button>
                                <Button onClick={handleEditSave} disabled={isEditPending} className="rounded-full px-6 gap-2">
                                    {isEditPending
                                        ? <><Loader2 className="size-4 animate-spin" />Saving...</>
                                        : <><Save className="size-4" />Save changes</>
                                    }
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete confirm */}
            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent className="rounded-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete this job listing?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. The listing will be permanently removed.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isPending} className="rounded-full">Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} disabled={isPending} className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-full">
                            {isPending ? <><Loader2 className="size-4 animate-spin mr-1" />Deleting...</> : 'Delete'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
