// Newsletter Queries

import { useMutation } from '@tanstack/react-query'
import { newsletterService } from './newsletter.service'
import { supabase } from '@/lib/supabase/supabase.client'
import type { NewsletterDTO } from './newsletter.types'


// service instance
const subscrpion = newsletterService({ supabase })


// Subscribe Newsletter
export const useSubscribeNewsletter = () => {
    return useMutation({
        mutationKey: ['newsletter', 'subscribe'],
        mutationFn: (payload: NewsletterDTO) => subscrpion.subscribeToNewsletter(payload),
    })
}
