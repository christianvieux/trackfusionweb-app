'use client'

import { useEffect, useState } from 'react'
import { Button, Modal } from '@heroui/react'

import { submitFeedback } from '../services/feedbackService'

const CATEGORY_OPTIONS = [
    { value: 'bug', label: 'Bug report' },
    { value: 'feedback', label: 'General feedback' },
    { value: 'feature', label: 'Feature suggestion' },
]

export default function FeedbackDialog({ isOpen, onOpenChange, errorContext = null }) {
    const [category, setCategory] = useState('bug')
    const [description, setDescription] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [successMessage, setSuccessMessage] = useState('')

    useEffect(() => {
        if (!isOpen) return
        setCategory(errorContext ? 'bug' : 'feedback')
        setDescription('')
        setErrorMessage('')
        setSuccessMessage('')
    }, [errorContext, isOpen])

    async function handleSubmit(event) {
        event.preventDefault()
        if (isSubmitting) return

        if (description.trim().length < 5) {
            setErrorMessage('Please provide at least 5 characters.')
            return
        }

        try {
            setIsSubmitting(true)
            setErrorMessage('')
            const response = await submitFeedback({
                category,
                description: description.trim(),
                source: errorContext ? 'error' : 'general',
                errorCode: errorContext?.code || undefined,
                referenceId: errorContext?.referenceId || undefined,
                pagePath:
                    typeof window === 'undefined'
                        ? undefined
                        : window.location.pathname,
            })
            setSuccessMessage(response.message)
            setDescription('')
        } catch (error) {
            setErrorMessage(error.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Modal.Backdrop
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            className="bg-backdrop"
        >
            <Modal.Container className="p-2 sm:p-4">
                <Modal.Dialog className="max-h-[calc(100dvh-1rem)] w-full min-w-0 max-w-md overflow-x-hidden overflow-y-auto rounded-2xl border-2 border-accent bg-surface text-foreground shadow-card sm:max-h-[calc(100dvh-2rem)]">
                    <Modal.CloseTrigger
                        aria-label="Close feedback form"
                        className="bg-muted text-foreground"
                    >
                        ×
                    </Modal.CloseTrigger>

                    <form
                        onSubmit={handleSubmit}
                        aria-busy={isSubmitting}
                        className="min-w-0"
                    >
                        <Modal.Header className="px-4 pt-6 pb-2 sm:px-5">
                            <div className="min-w-0 space-y-1 pr-6">
                                <Modal.Heading className="break-words text-xl font-bold text-primary">
                                    {errorContext
                                        ? 'Report this error'
                                        : 'Report a problem / Send feedback'}
                                </Modal.Heading>
                                <p className="text-sm text-muted-foreground">
                                    Nothing is sent until you submit this form.
                                </p>
                            </div>
                        </Modal.Header>

                        <Modal.Body className="min-w-0 space-y-4 px-4 py-4 sm:px-5">
                            {errorContext && (
                                <div className="rounded-lg border border-accent/60 bg-muted p-3 text-xs">
                                    <p>
                                        Error: {errorContext.code || 'Unexpected error'}
                                    </p>
                                    <p className="break-all text-muted-foreground">
                                        Reference: {errorContext.referenceId}
                                    </p>
                                </div>
                            )}

                            <label className="block min-w-0 space-y-1 text-sm text-secondary-foreground">
                                <span className="font-medium text-secondary-foreground">
                                    Category
                                </span>
                                <select
                                    value={category}
                                    onChange={(event) =>
                                        setCategory(event.target.value)
                                    }
                                    disabled={isSubmitting}
                                    className="w-full max-w-full rounded-lg border border-accent bg-muted px-3 py-2 text-base text-secondary-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/40 disabled:opacity-60"
                                >
                                    {CATEGORY_OPTIONS.map((option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label className="block min-w-0 space-y-1 text-sm text-secondary-foreground">
                                <span className="font-medium text-secondary-foreground">
                                    What happened or what should improve?
                                </span>
                                <textarea
                                    value={description}
                                    onChange={(event) =>
                                        setDescription(event.target.value)
                                    }
                                    maxLength={2000}
                                    rows={5}
                                    disabled={isSubmitting}
                                    placeholder="Describe the issue or suggestion"
                                    className="w-full max-w-full resize-y rounded-lg border border-accent bg-muted px-3 py-2 text-base text-secondary-foreground outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/40 disabled:opacity-60"
                                />
                                <span className="block text-right text-xs text-muted-foreground">
                                    {description.length}/2000
                                </span>
                            </label>

                            {errorMessage && (
                                <p
                                    role="alert"
                                    className="break-words text-sm text-danger"
                                >
                                    {errorMessage}
                                </p>
                            )}
                            {successMessage && (
                                <p
                                    role="status"
                                    className="break-words text-sm text-success"
                                >
                                    {successMessage}
                                </p>
                            )}
                        </Modal.Body>

                        <Modal.Footer className="flex flex-col-reverse gap-2 px-4 pb-5 sm:flex-row sm:justify-end sm:px-5">
                            <Button
                                type="button"
                                variant="light"
                                onPress={() => onOpenChange(false)}
                                isDisabled={isSubmitting}
                                className="w-full sm:w-auto"
                            >
                                Close
                            </Button>
                            <Button
                                type="submit"
                                color="primary"
                                isLoading={isSubmitting}
                                isDisabled={
                                    isSubmitting ||
                                    description.trim().length < 5
                                }
                                className="w-full sm:w-auto"
                            >
                                Submit
                            </Button>
                        </Modal.Footer>
                    </form>
                </Modal.Dialog>
            </Modal.Container>
        </Modal.Backdrop>
    )
}
