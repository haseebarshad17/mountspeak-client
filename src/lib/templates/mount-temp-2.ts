import type { TemplateStyles } from '@/lib/templates/types'

/** Editorial — left-aligned hero, softer rounded filters. */
export const mountTemp2Styles: TemplateStyles = {
    header: {
        shell: 'rounded-2xl',
    },
    hero: {
        content: 'mr-auto w-full max-w-[900px] text-left',
        heading:
            'text-[28px] font-semibold leading-[1.15] sm:text-4xl md:text-5xl lg:text-[52px] xl:text-[56px]',
        paragraph: 'max-w-[640px] pt-4 text-sm font-normal sm:pt-5 sm:text-base xl:text-lg',
        filtersWrap: 'mr-auto w-full max-w-[960px] pt-6 sm:pt-8 md:pt-10 lg:pt-12 xl:pt-14',
    },
    heroFilters: {
        form: 'rounded-2xl xl:rounded-2xl',
        field: 'rounded-xl xl:rounded-none',
        searchButton: '!rounded-full xl:!rounded-xl',
    },
}
