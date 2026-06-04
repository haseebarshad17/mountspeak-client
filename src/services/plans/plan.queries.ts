import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/supabase.client'
import { plansService } from './plan.service'


// service instance
const plans = plansService({ supabase })


// Get Plans
export const usePlans = () => {
    return useQuery({
        queryKey: ['plans'],
        queryFn: plans.getPlans
    })
}

// Get Plan By ID
export const usePlanById = (id: string) => {
    return useQuery({
        queryKey: ['plan', id],
        queryFn: () => plans.getPlanById(id)
    })
}

