import type { TemplateStyles } from '@/lib/templates/types'

/** Classic — current live default homepage look. */
export const mountTemp1Styles: TemplateStyles = {
    generic: {
        header: {
            shell: 'rounded-xl',
        },
        footer: {
            outer: 'bg-[#E8F3F2] px-3 py-8 xs:px-4 xs:py-10 sm:py-12 md:py-14',
            shellWrap: 'agency-container',
            shell: 'relative overflow-hidden rounded-2xl xs:rounded-[24px] sm:rounded-[28px] md:rounded-[32px]',
            pattern: 'pointer-events-none absolute inset-0',
            content:
                'relative flex flex-col px-5 py-8 xs:px-6 xs:py-9 sm:px-8 sm:py-10 md:px-10 lg:px-12 lg:py-12',
            mainGrid:
                'order-1 grid gap-8 xs:gap-9 sm:gap-10 xl:gap-14 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:items-start lg:gap-10',
            brandBlock: 'flex min-w-0 flex-col items-start gap-4 xs:gap-5 sm:gap-5',
            columnsGrid: 'grid min-w-0 grid-cols-2 gap-x-6 gap-y-6',
            newsletterSection:
                'order-2 mt-8 border-t border-white/10 pt-6 xs:mt-9 xs:pt-7 sm:mt-10 sm:pt-8 lg:mt-11 lg:pt-9',
            newsletterInner: 'w-full max-w-lg',
            newsletterCopy: '',
            newsletterTitle: 'text-sm font-semibold text-white xs:text-base',
            newsletterDesc: 'mt-1.5 max-w-sm text-sm leading-6 text-white/75',
            newsletterForm: 'mt-3.5 flex w-full max-w-sm items-center gap-2 xs:mt-4',
            newsletterInput: [
                'h-10 w-full min-w-0 flex-1 rounded-full border border-white/25 bg-transparent px-3.5',
                'text-sm text-white placeholder:text-white/50 outline-none',
                'transition-[border-color,background-color,box-shadow] duration-200',
                'hover:border-white/40',
                'focus:border-white/50 focus:bg-white/5 focus:ring-2 focus:ring-white/15',
                'xs:h-11 xs:px-4',
            ].join(' '),
            newsletterButton: [
                'h-10 shrink-0 rounded-full border-0 bg-white px-4 text-black',
                '!normal-case !tracking-normal hover:bg-white/90 focus-visible:bg-white/90',
                'xs:h-11 xs:px-5 font-medium',
            ].join(' '),
            bottomBar: 'relative border-t border-white/10 px-5 py-3.5 text-center xs:px-6 xs:py-4 sm:px-8',
            copyright: 'text-xs leading-5 text-white/75 sm:text-sm',
            accentBar: 'h-1.5 w-full sm:h-2',
            ghostBrand: 'hidden',
        },
    },
    pages: {
        home: {
            hero: {
                section: 'p-2 sm:p-3 md:p-4 lg:p-5',
                banner: 'relative overflow-hidden rounded-[16px] bg-cover bg-center bg-no-repeat',
                overlay: 'absolute inset-0 bg-black/15',
                main: 'pb-8 pt-[150px] sm:pb-10 sm:pt-40 md:pb-12 md:pt-48 lg:pb-16 lg:pt-56 xl:pb-[100px] xl:pt-[257px]',
                content: 'mx-auto w-full max-w-[828px] text-center',
                heading:
                    'text-[26px] font-semibold leading-[1.1] sm:text-3xl sm:leading-[0.95] md:text-4xl lg:text-5xl xl:text-[45px]',
                paragraph: 'pt-3 text-sm font-normal sm:pt-4 sm:text-base xl:text-lg',
                filtersWrap: 'mx-auto w-full max-w-[867px] pt-6 sm:pt-8 md:pt-10 lg:pt-12 xl:pt-14',
                tabsWrap: 'mx-auto mb-4 flex flex-wrap items-center justify-center gap-2',
            },
            heroFilters: {
                form: 'rounded-lg xl:rounded-[6px] xl:mx-auto',
                field: 'rounded-md xl:rounded-none',
                searchButton: '!rounded-xl xl:!rounded-[3px]',
            },
            sectionHeader: {
                wrap: 'mx-auto max-w-3xl text-center',
                title: 'agency-section-heading',
                eyebrow: '',
            },
            tourCard: {
                shell: [
                    'group relative mx-auto flex h-full w-full max-w-[416px] flex-col overflow-hidden',
                    'rounded-xl border border-[#E3E8EA] bg-white',
                    'shadow-[0_1px_8px_rgba(0,41,44,0.05)]',
                    'transition-all duration-300 hover:-translate-y-0.5 hover:border-[#C0C8C9] hover:shadow-[0_8px_24px_rgba(0,41,44,0.1)]',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hp-color-primary)]/30 focus-visible:ring-offset-2',
                    'lg:mx-0',
                ].join(' '),
                imageWrap: 'relative aspect-[16/10] overflow-hidden bg-[#EEF2F3]',
                content: 'flex flex-1 flex-col px-3.5 py-3 sm:px-4 sm:py-3.5',
                cta: 'mt-3 inline-flex h-10 w-full items-center justify-center rounded-md text-sm font-semibold text-white transition-opacity duration-300 group-hover:opacity-95',
                discountBadge: 'absolute right-3 top-3 z-10 sm:right-3.5 sm:top-3.5',
                discountPill: [
                    'inline-flex min-w-[72px] items-center justify-center rounded-full px-3 py-1.5',
                    'font-roboto text-[11px] font-semibold leading-none tracking-wide text-white',
                    'shadow-[0_4px_12px_rgba(0,41,44,0.22)] ring-1 ring-white/25 sm:min-w-[80px] sm:px-3.5 sm:py-2 sm:text-xs',
                ].join(' '),
                categoryBadge:
                    'absolute bottom-3 right-3 rounded-full border border-white/30 bg-black/55 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm',
                saveShare: 'absolute left-3 top-3 z-20',
            },
            destinationCard: {
                shell: 'my-2 h-auto w-full rounded-[20px] bg-white p-3 pb-3 shadow-[0_4px_30px_rgba(0,0,0,0.08)] sm:my-7 sm:p-3.5 sm:pb-4',
                image: 'relative h-[190px] w-full overflow-hidden rounded-[16px] sm:h-[240px] lg:h-[260px]',
                content: 'px-1 pt-3 sm:pt-4',
            },
            trust: {
                section: '-mt-4 overflow-hidden bg-white sm:-mt-6',
                header: 'mx-auto max-w-2xl px-1 text-center sm:px-0',
                title: 'agency-section-heading pt-2 text-[22px] font-medium leading-tight sm:pt-3 sm:text-[28px] sm:leading-8 lg:text-[32px] lg:leading-9',
                row: 'mt-6 flex flex-wrap items-center justify-center gap-6 px-4 sm:mt-8 sm:gap-10',
            },
            planPerfectTrip: {
                grid: 'grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-10 lg:gap-12 xl:gap-14',
                media: 'w-full max-w-[580px] justify-self-center md:justify-self-start',
                copy: 'w-full max-w-[612px]',
                stats: 'grid w-full grid-cols-2 gap-x-4 gap-y-5 pt-6 sm:gap-x-6 sm:gap-y-6 sm:pt-8',
            },
            services: {
                section: 'py-10 sm:py-16 lg:py-[100px]',
                header: 'mx-auto max-w-2xl text-center',
                grid: 'mx-auto grid w-full max-w-[1312px] grid-cols-1 gap-3 pt-6 sm:gap-5 sm:pt-8 md:grid-cols-2 md:pt-10 lg:gap-6 lg:pt-12',
                card: 'mx-auto flex w-full max-w-[636px] min-h-0 items-center rounded-[10px] border bg-white px-4 py-3 shadow-sm sm:min-h-[162px] sm:px-[24px] sm:py-4',
            },
            popularDestination: {
                header: 'mx-auto max-w-3xl text-center',
                listHeader: '',
                carouselWrap: 'overflow-x-hidden pt-4 sm:pt-6',
            },
            explore: {
                header: 'mx-auto max-w-[900px] px-1 text-center sm:px-0',
                grid: 'grid grid-cols-1 justify-items-center gap-4 pt-8 xs:gap-5 sm:grid-cols-2 sm:gap-6 sm:pt-10 md:pt-12 lg:grid-cols-3 lg:justify-items-stretch lg:gap-6 lg:pt-14',
            },
            gallery: {
                header: 'mx-auto max-w-[900px] px-1 text-center sm:px-0',
                grid: 'mx-auto mt-6 hidden max-w-[1424px] sm:mt-8 sm:grid sm:grid-cols-3 sm:gap-[12px] lg:mt-2 lg:grid-cols-6',
                tile: 'group relative aspect-[229.33/305.77] w-full overflow-hidden rounded-[10px] cursor-zoom-in bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hp-color-primary)] focus-visible:ring-offset-2',
            },
            bookATour: {
                overlay: 'absolute inset-0 bg-gradient-to-br from-black/45 via-black/30 to-black/40',
                grid: 'grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-16',
                copy: 'text-white',
                formPanel:
                    'min-w-0 overflow-hidden rounded-[12px] border border-[#D5DADD] bg-[#EEF1F3] p-4 sm:rounded-[16px] sm:p-6',
            },
            team: {
                header: 'mx-auto max-w-3xl text-center',
                grid: 'mx-auto grid max-w-[1200px] grid-cols-2 gap-3 pt-8 sm:gap-8 sm:pt-12 lg:grid-cols-4 lg:gap-8 lg:pt-14',
                card: 'h-auto w-full overflow-hidden rounded-xl bg-neutral-100 shadow-sm sm:max-w-[306px] sm:rounded-2xl sm:h-[424px]',
                cardBody:
                    'h-auto px-2 py-3 text-center sm:h-[124px] sm:max-w-[306px] sm:px-5 sm:py-6',
            },
            blogs: {
                header: 'mx-auto max-w-[861px] text-center',
                grid: 'mx-auto grid grid-cols-1 gap-4 pt-8 sm:grid-cols-2 sm:gap-6 sm:pt-12 lg:grid-cols-3 lg:gap-6 lg:pt-14',
                card: 'flex h-full w-full min-w-0 flex-col overflow-hidden rounded-xl border bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)]',
                cardContent: 'flex min-w-0 flex-1 flex-col p-4 sm:p-6',
            },
            testimonials: {
                header: 'mx-auto max-w-3xl text-center',
                quote: 'testimonial-quote relative mx-auto w-full max-w-[400px] rounded-xl px-5 pb-16 pt-8 text-center transition-colors duration-300 sm:px-7 sm:pb-[72px] sm:pt-10',
                meta: 'mt-14 text-center sm:mt-16',
            },
        },
        about: {},
    },
}
