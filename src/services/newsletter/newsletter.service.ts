// Newsletter Service

import type {
    NewsletterDTO,
    NewsletterServiceProps,
    SubscribeEmailResponse,
} from './newsletter.types'

export const newsletterService = ({ supabase }: NewsletterServiceProps) => ({
    subscribeToNewsletter: async (
        payload: NewsletterDTO,
    ): Promise<SubscribeEmailResponse> => {
        const email = payload.email.trim().toLowerCase()
        const agency_id = payload.agency_id ?? null

        const { error } = await supabase.from('subscribe').insert({
            email,
            status: 'SUBSCRIBED',
            agency_id,
        })

        if (error) {
            if (error.code === '23505') {
                return {
                    success: true,
                    already_subscribed: true,
                    message: 'You are already subscribed.',
                    id: '',
                    email,
                    status: 'SUBSCRIBED',
                    agency_id,
                }
            }

            throw new Error(error.message)
        }

        return {
            success: true,
            already_subscribed: false,
            message: 'Successfully subscribed to the newsletter.',
            id: '',
            email,
            status: 'SUBSCRIBED',
            agency_id,
        }
    },
})
