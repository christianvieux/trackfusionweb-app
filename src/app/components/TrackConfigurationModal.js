'use client'

import { useEffect, useMemo, useState } from 'react'
import { Button, Modal } from '@heroui/react'

import { updateTrack } from '../services/trackService'
import { deleteOwnedTrack } from '../services/userService'
import { useTrackEvents } from '../context/TrackEventsContext'

const INITIAL_FORM = {
    name: '',
    description: '',
    isPublic: true,
}

function getInitialForm(track) {
    return {
        name: track?.name || '',
        description: track?.description || '',
        isPublic: !track?.is_private,
    }
}

export default function TrackConfiguration({
    trackDetails,
    isModalOpen,
    onModalOpenChange,
    closeModal,
}) {
    const { notifyTrackUpdated, notifyTrackDeleted } = useTrackEvents()
    const [form, setForm] = useState(INITIAL_FORM)
    const [fieldErrors, setFieldErrors] = useState({})
    const [errorMessage, setErrorMessage] = useState('')
    const [loadingAction, setLoadingAction] = useState('')
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)

    const originalForm = useMemo(() => {
        return getInitialForm(trackDetails)
    }, [trackDetails])

    const isBusy = Boolean(loadingAction)

    const hasChanges =
        form.name !== originalForm.name ||
        form.description !== originalForm.description ||
        form.isPublic !== originalForm.isPublic

    const isSaveDisabled = !trackDetails?.id || !hasChanges || isBusy

    function resetState() {
        setErrorMessage('')
        setFieldErrors({})
        setLoadingAction('')
        setShowDeleteConfirmation(false)
        setForm(getInitialForm(trackDetails))
    }

    function handleClose() {
        resetState()
        closeModal?.()
    }

    function updateField(event) {
        const { name, value, checked, type } = event.target

        setForm((currentForm) => ({
            ...currentForm,
            [name]: type === 'checkbox' ? checked : value,
        }))

        setErrorMessage('')
        setFieldErrors((currentErrors) => {
            if (!currentErrors[name]) return currentErrors
            const nextErrors = { ...currentErrors }
            delete nextErrors[name]
            return nextErrors
        })
    }

    async function handleSave(event) {
        event.preventDefault()

        const nextFieldErrors = {}
        if (!form.name.trim()) {
            nextFieldErrors.name = 'Track title is required.'
        } else if (form.name.trim().length > 100) {
            nextFieldErrors.name = 'Track title cannot exceed 100 characters.'
        }
        if (form.description.length > 500) {
            nextFieldErrors.description =
                'Track description cannot exceed 500 characters.'
        }
        setFieldErrors(nextFieldErrors)
        if (Object.keys(nextFieldErrors).length > 0 || isSaveDisabled) return

        try {
            setErrorMessage('')
            setLoadingAction('save')

            const updatedValues = {
                name: form.name.trim(),
                description: form.description.trim(),
                is_private: !form.isPublic,
            }

            await updateTrack(trackDetails.id, updatedValues)

            const updatedTrack = {
                ...trackDetails,
                ...updatedValues,
            }

            notifyTrackUpdated(updatedTrack)

            onModalOpenChange?.(false)
            closeModal?.()
            resetState()
        } catch (error) {
            setErrorMessage(error.message || 'Failed to update track.')
        } finally {
            setLoadingAction('')
        }
    }

    function handleDeleteClick() {
        setErrorMessage('')
        setShowDeleteConfirmation(true)
    }

    async function confirmDelete() {
        if (!trackDetails?.id) return

        try {
            setErrorMessage('')
            setLoadingAction('delete')

            await deleteOwnedTrack(trackDetails.id)

            notifyTrackDeleted(trackDetails.id)

            setShowDeleteConfirmation(false)
            onModalOpenChange?.(false)
            closeModal?.()
        } catch (error) {
            setErrorMessage(error.message || 'Failed to delete track.')
        } finally {
            setLoadingAction('')
        }
    }

    useEffect(() => {
        if (isModalOpen) {
            setForm(getInitialForm(trackDetails))
            setFieldErrors({})
            setErrorMessage('')
            setShowDeleteConfirmation(false)
        }
    }, [isModalOpen, trackDetails])

    return (
        <>
            <Modal.Backdrop
                isOpen={isModalOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        handleClose()
                        return
                    }

                    onModalOpenChange?.(true)
                }}
                className="bg-backdrop"
            >
                <Modal.Container className="p-3 sm:p-4">
                    <Modal.Dialog className="max-h-[calc(100dvh-1.5rem)] w-full min-w-0 max-w-lg overflow-y-auto rounded-2xl border-2 border-accent bg-surface text-foreground shadow-card sm:max-h-[calc(100dvh-2rem)]">
                        <Modal.CloseTrigger
                            aria-label="Close track configuration"
                            className="bg-muted text-foreground"
                            onPress={handleClose}
                        >
                            ×
                        </Modal.CloseTrigger>

                        <form onSubmit={handleSave}>
                            <Modal.Header className="px-6 pt-6 pb-2">
                                <div className="flex flex-col gap-1">
                                    <Modal.Heading className="text-xl font-bold text-primary">
                                        Track Configuration
                                    </Modal.Heading>

                                    <p className="text-sm text-muted-foreground">
                                        Update this track&apos;s details or
                                        remove it from your account.
                                    </p>
                                </div>
                            </Modal.Header>

                            <Modal.Body className="min-w-0 px-4 py-4 sm:px-6">
                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-col gap-1">
                                        <label
                                            htmlFor="track-name"
                                            className="text-sm font-medium text-muted-foreground"
                                        >
                                            Track Name
                                        </label>

                                        <input
                                            id="track-name"
                                            name="name"
                                            value={form.name}
                                            onChange={updateField}
                                            disabled={isBusy}
                                            maxLength={101}
                                            aria-invalid={Boolean(
                                                fieldErrors.name
                                            )}
                                            aria-describedby="track-name-error"
                                            className="w-full min-w-0 rounded-lg border border-accent bg-muted px-3 py-2 text-foreground outline-none focus:border-primary"
                                            placeholder="Track name"
                                        />
                                        <div className="flex min-h-5 justify-between gap-3 text-xs">
                                            <p
                                                id="track-name-error"
                                                className="text-danger"
                                            >
                                                {fieldErrors.name}
                                            </p>
                                            <span className="shrink-0 text-muted-foreground">
                                                {form.name.length}/100
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <label
                                            htmlFor="track-description"
                                            className="text-sm font-medium text-muted-foreground"
                                        >
                                            Description
                                        </label>

                                        <textarea
                                            id="track-description"
                                            name="description"
                                            value={form.description}
                                            onChange={updateField}
                                            disabled={isBusy}
                                            rows={4}
                                            maxLength={501}
                                            aria-invalid={Boolean(
                                                fieldErrors.description
                                            )}
                                            aria-describedby="track-description-error"
                                            className="w-full min-w-0 resize-none rounded-lg border border-accent bg-muted px-3 py-2 text-foreground outline-none focus:border-primary"
                                            placeholder="Add a description"
                                        />
                                        <div className="flex min-h-5 justify-between gap-3 text-xs">
                                            <p
                                                id="track-description-error"
                                                className="text-danger"
                                            >
                                                {fieldErrors.description}
                                            </p>
                                            <span className="shrink-0 text-muted-foreground">
                                                {form.description.length}/500
                                            </span>
                                        </div>
                                    </div>

                                    <label className="flex cursor-pointer items-center justify-between rounded-lg border border-accent/50 bg-muted p-3">
                                        <div>
                                            <p className="font-medium text-foreground">
                                                Public Track
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Public tracks can be viewed by
                                                other users.
                                            </p>
                                        </div>

                                        <input
                                            name="isPublic"
                                            type="checkbox"
                                            checked={form.isPublic}
                                            onChange={updateField}
                                            disabled={isBusy}
                                            className="size-5 accent-primary"
                                        />
                                    </label>

                                    {errorMessage && (
                                        <p
                                            role="alert"
                                            className="rounded-lg border border-danger/40 bg-danger/10 p-2 text-center text-sm text-danger"
                                        >
                                            {errorMessage}
                                        </p>
                                    )}
                                </div>
                            </Modal.Body>

                            <Modal.Footer className="flex flex-col-reverse gap-3 px-4 pb-4 sm:flex-row sm:justify-between sm:px-6 sm:pb-6">
                                <Button
                                    variant="bordered"
                                    color="danger"
                                    onPress={handleDeleteClick}
                                    isDisabled={isBusy}
                                >
                                    Delete this track
                                </Button>

                                <div className="flex gap-2">
                                    <Button
                                        variant="light"
                                        className="text-muted-foreground"
                                        onPress={handleClose}
                                        isDisabled={isBusy}
                                    >
                                        Close
                                    </Button>

                                    <Button
                                        type="submit"
                                        className="bg-primary text-background hover:bg-primary-hover"
                                        isDisabled={isSaveDisabled}
                                        isLoading={loadingAction === 'save'}
                                    >
                                        Save
                                    </Button>
                                </div>
                            </Modal.Footer>
                        </form>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>

            <Modal.Backdrop
                isOpen={showDeleteConfirmation}
                onOpenChange={setShowDeleteConfirmation}
                className="bg-backdrop"
            >
                <Modal.Container className="p-3 sm:p-4">
                    <Modal.Dialog className="w-full min-w-0 max-w-md rounded-2xl border-2 border-danger bg-surface text-foreground shadow-card">
                        <Modal.Header className="px-6 pt-6 pb-2">
                            <Modal.Heading className="text-xl font-bold text-danger">
                                Delete this track?
                            </Modal.Heading>
                        </Modal.Header>

                        <Modal.Body className="px-6 py-4">
                            <p className="text-sm text-muted-foreground">
                                Are you sure you want to delete{' '}
                                <span className="font-semibold text-foreground">
                                    {trackDetails?.name || 'this track'}
                                </span>
                                ? You won&apos;t be able to recover it.
                            </p>
                        </Modal.Body>

                        <Modal.Footer className="flex justify-between gap-3 px-6 pb-6">
                            <Button
                                variant="light"
                                onPress={() => setShowDeleteConfirmation(false)}
                                isDisabled={isBusy}
                            >
                                No
                            </Button>

                            <Button
                                color="danger"
                                onPress={confirmDelete}
                                isDisabled={isBusy}
                                isLoading={loadingAction === 'delete'}
                            >
                                Yes, delete it
                            </Button>
                        </Modal.Footer>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </>
    )
}
