'use client'

import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { useSearchParams } from 'next/navigation'

import {
    getTemplateStyles,
    TEMPLATE_ID_QUERY_PARAM,
    type TemplateStyles,
} from '@/lib/templates'
import { selectHomepageTemplateId } from '@/store/homepage/homepage.selectors'
import { useAppSelector } from '@/store/hooks'

const TemplateStylesContext = createContext<TemplateStyles>(getTemplateStyles(null))

export function TemplateStylesProvider({ children }: { children: ReactNode }) {
    const searchParams = useSearchParams()
    const previewTemplateId = searchParams.get(TEMPLATE_ID_QUERY_PARAM)
    const savedTemplateId = useAppSelector(selectHomepageTemplateId)

    // Preview query overrides the persisted theme JSON template id.
    const templateId = previewTemplateId?.trim() || savedTemplateId

    const styles = useMemo(() => getTemplateStyles(templateId), [templateId])

    return (
        <TemplateStylesContext.Provider value={styles}>
            {children}
        </TemplateStylesContext.Provider>
    )
}

export function useTemplateStyles(): TemplateStyles {
    return useContext(TemplateStylesContext)
}
