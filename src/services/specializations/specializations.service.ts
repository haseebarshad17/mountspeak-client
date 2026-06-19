import type { SupabaseClient } from '@supabase/supabase-js'

import type { Specialization } from './specializations.types'

type SpecializationsServiceProps = {
    supabase: SupabaseClient
}

export const specializationsService = ({ supabase }: SpecializationsServiceProps) => {
    return {
        /** GET /rest/v1/specializations?select=id,name */
        getAll: async (): Promise<Specialization[]> => {
            const { data, error } = await supabase
                .from('specializations')
                .select('id, name')
                .order('name')

            if (error) throw error

            return (data ?? [])
                .filter(
                    (row): row is { id: string; name: string } =>
                        typeof row.id === 'string' && typeof row.name === 'string',
                )
                .map((row) => ({
                    id: row.id,
                    name: row.name.trim(),
                }))
                .filter((row) => row.name.length > 0)
        },
    }
}
