import { describe, expect, it } from 'vitest'

import { getFeedbackErrorMessage } from './feedbackService'

describe('feedbackService', () => {
    it('gives signed-out visitors an actionable message', () => {
        expect(
            getFeedbackErrorMessage({
                status: 401,
                message: 'Authentication required',
            })
        ).toBe(
            'Sign in to send feedback, or email me from the Contact page.'
        )
    })

    it('preserves safe API messages for other failures', () => {
        expect(
            getFeedbackErrorMessage({
                status: 429,
                message: 'Too many requests. Please wait a moment and try again.',
            })
        ).toBe('Too many requests. Please wait a moment and try again.')
    })
})
