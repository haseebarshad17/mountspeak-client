import type { TemplateStyles } from '@/lib/templates/types'

/** Editorial — left-aligned hero, soft cards, dark full-bleed footer. */
export const mountTemp2Styles: TemplateStyles = {
    generic: {
        header: {
            shell: 'rounded-2xl',
        },
        footer: {
            outer: 'bg-[#E8F3F2] px-3 py-8 xs:px-4 xs:py-10 sm:py-12 md:py-14',
            shell: 'relative overflow-hidden rounded-2xl xs:rounded-[24px] sm:rounded-[28px] md:rounded-[32px]',
            pattern: 'hidden',
            content:
                'relative z-[1] flex flex-col gap-8 px-5 py-8 xs:gap-9 xs:px-6 xs:py-9 sm:gap-10 sm:px-8 sm:py-10 md:px-10 lg:gap-11 lg:px-12 lg:py-12',
            mainGrid:
                'order-2 grid gap-8 xs:gap-9 sm:gap-10 xl:gap-14 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:items-start lg:gap-10',
            brandBlock: 'flex min-w-0 flex-col items-start gap-4 xs:gap-5 sm:gap-5',
            columnsGrid: 'grid min-w-0 grid-cols-2 gap-x-6 gap-y-6',
            newsletterSection: 'order-1',
            newsletterInner: [
                'flex w-full flex-col gap-4 rounded-2xl bg-black/20 px-5 py-4',
                'sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:rounded-full sm:px-8 sm:pl-10 sm:py-3.5',
            ].join(' '),
            newsletterCopy: 'min-w-0 flex-1 sm:pr-4',
            newsletterTitle: 'text-sm font-semibold text-white xs:text-base',
            newsletterDesc: 'mt-1 max-w-sm text-sm leading-6 text-white/75',
            newsletterForm: 'flex w-full max-w-md shrink-0 items-center gap-2 sm:max-w-lg',
            newsletterInput: [
                'h-10 w-full min-w-0 flex-1 rounded-full border border-white/20 bg-black/35 px-3.5',
                'text-sm text-white placeholder:text-white/50 outline-none',
                'transition-[border-color,background-color,box-shadow] duration-200',
                'hover:border-white/35 hover:bg-black/40',
                'focus:border-white/45 focus:bg-black/45 focus:ring-2 focus:ring-white/15',
                'xs:h-11 xs:px-4',
            ].join(' '),
            newsletterButton: [
                'h-10 shrink-0 rounded-full border-0 !bg-white !text-black px-4',
                '!normal-case !tracking-normal hover:!bg-white/90 focus-visible:!bg-white/90',
                'xs:h-11 xs:px-5 font-medium',
            ].join(' '),
            bottomBar:
                'relative z-[1] border-t border-white/10 px-5 py-3.5 xs:px-6 xs:py-4 sm:px-8',
            copyright: 'text-xs leading-5 text-white/75 sm:text-sm',
            accentBar: 'hidden',
            ghostBrand: 'hidden',
        },
    },
    pages: {
        home: {
            hero: {
                content: 'mr-auto w-full max-w-[900px] text-left',
                heading:
                    'text-[28px] font-semibold leading-[1.15] sm:text-4xl md:text-5xl lg:text-[52px] xl:text-[56px]',
                paragraph: 'max-w-[640px] pt-4 text-sm font-normal sm:pt-5 sm:text-base xl:text-lg',
                filtersWrap: 'mr-auto w-full max-w-[960px] pt-6 sm:pt-8 md:pt-10 lg:pt-12 xl:pt-14',
                tabsWrap: 'mr-auto mb-4 flex flex-wrap items-center justify-start gap-2',
            },
            heroFilters: {
                form: 'rounded-2xl xl:rounded-2xl xl:mr-auto xl:ml-0',
                field: 'rounded-xl xl:rounded-none',
                searchButton: '!rounded-full xl:!rounded-xl',
            },
            sectionHeader: {
                wrap: 'mx-auto text-center',
                title: 'agency-section-heading',
            },
            tourCard: {
                shell: [
                    'group relative mx-auto flex h-full w-full max-w-[416px] flex-col overflow-hidden',
                    'rounded-3xl border-0 bg-white',
                    'shadow-[0_8px_32px_rgba(0,0,0,0.1)]',
                    'transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.14)]',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hp-color-primary)]/30 focus-visible:ring-offset-2',
                    'lg:mx-0',
                ].join(' '),
                imageWrap: 'relative aspect-[16/11] overflow-hidden bg-[#EEF2F3]',
                content: 'flex flex-1 flex-col px-4 py-4 sm:px-5 sm:py-5',
                cta: 'mt-3 inline-flex h-11 w-full items-center justify-center rounded-full text-sm font-semibold text-white transition-opacity duration-300 group-hover:opacity-95',
                discountBadge: 'absolute bottom-3 right-3 z-10 sm:bottom-3.5 sm:right-3.5',
                discountPill: [
                    'inline-flex min-w-0 items-center justify-center rounded-md px-2.5 py-1.5',
                    'font-roboto text-[11px] font-bold uppercase leading-none tracking-wide text-white',
                    '!bg-emerald-600 shadow-none ring-0 sm:px-3 sm:py-2 sm:text-xs',
                ].join(' '),
                categoryBadge:
                    'absolute right-3 top-3 rounded-full border-0 bg-white/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-zinc-800 shadow-sm backdrop-blur-sm',
                saveShare: 'absolute left-3 bottom-3 z-20 sm:left-3.5 sm:bottom-3.5',
            },
            destinationCard: {
                shell: 'my-2 h-auto w-full overflow-hidden rounded-3xl bg-white p-0 pb-4 shadow-[0_8px_32px_rgba(0,0,0,0.1)] sm:my-7 sm:pb-5',
                image: 'relative h-[200px] w-full overflow-hidden rounded-none sm:h-[250px] lg:h-[270px]',
                content: 'px-4 pt-3 sm:px-5 sm:pt-4',
            },
            trust: {},
            planPerfectTrip: {},
            services: {},
            popularDestination: {},
            explore: {},
            gallery: {},
            bookATour: {},
            team: {},
            blogs: {},
            testimonials: {},
        },
        about: {},
    },
}
