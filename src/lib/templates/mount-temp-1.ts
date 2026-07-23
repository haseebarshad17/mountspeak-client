import type { TemplateStyles } from '@/lib/templates/types'

/** Classic — centered hero, compact squared filters (current default look). */
export const mountTemp1Styles: TemplateStyles = {
    header: {
        shell: 'rounded-xl',
    },
    hero: {
        content: 'mx-auto w-full max-w-[828px] text-center',
        heading:
            'text-[26px] font-semibold leading-[1.1] sm:text-3xl sm:leading-[0.95] md:text-4xl lg:text-5xl xl:text-[45px]',
        paragraph: 'pt-3 text-sm font-normal sm:pt-4 sm:text-base xl:text-lg',
        filtersWrap: 'mx-auto w-full max-w-[867px] pt-6 sm:pt-8 md:pt-10 lg:pt-12 xl:pt-14',
    },
    heroFilters: {
        form: 'rounded-lg xl:rounded-[6px]',
        field: 'rounded-md xl:rounded-none',
        searchButton: '!rounded-xl xl:!rounded-[3px]',
    },
}
