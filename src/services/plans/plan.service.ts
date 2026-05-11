type PlansServiceProps = {
    supabase: any
}

export const plansService = ({ supabase }: PlansServiceProps) => {
    return {

        // Get Plans
        getPlans: async () => {
            const { data, error } =
                await supabase
                    .from('plans')
                    .select('*')

            if (error) throw error

            return data
        },

        // Get Plan By ID 
        getPlanById: async (id: string) => {
            const { data, error } =
                await supabase
                    .from('plans')
                    .select('*')
                    .eq('id', id)

            if (error) throw error

            return data
        },

    }
}