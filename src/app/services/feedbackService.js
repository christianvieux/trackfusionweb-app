import { apiClient, toApiError } from './apiClient'

export function getFeedbackErrorMessage(error) {
    if (error?.status === 401) {
        return 'Sign in to send feedback, or email me from the Contact page.'
    }

    return error?.message || "We couldn't save your report. Please try again later."
}

export async function submitFeedback(report) {
    try {
        const response = await apiClient.post('/feedback', report)
        return response.data
    } catch (error) {
        const apiError = toApiError(
            error,
            "We couldn't save your report. Please try again later."
        )
        apiError.message = getFeedbackErrorMessage(apiError)
        throw apiError
    }
}
