import type { TemplateStyles } from '@/lib/templates/types'

/**
 * Studio — cohesive premium system across every homepage section.
 * Left-led headers from md+, soft 24–28px chrome, stronger elevation & rhythm.
 */
export const mountTemp2Styles: TemplateStyles = {
    generic: {
        header: {
            shell: 'rounded-[18px] sm:rounded-[20px] backdrop-blur-sm',
        },
        footer: {
            outer: 'bg-[#E8F3F2] px-3 py-8 xs:px-4 xs:py-10 sm:py-12 md:py-14',
            shellWrap: 'agency-container',
            shell: 'relative overflow-hidden rounded-[24px] xs:rounded-[28px] sm:rounded-[32px] md:rounded-[36px]',
            pattern: 'hidden',
            content: [
                'relative z-[1] flex flex-col',
                'px-5 py-9 xs:px-6 xs:py-10 sm:px-9 sm:py-11 md:px-11 lg:px-12 lg:py-12',
            ].join(' '),
            mainGrid: [
                'order-1 grid gap-10',
                'sm:gap-11 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-start lg:gap-14 xl:gap-20',
            ].join(' '),
            brandBlock: 'flex min-w-0 flex-col items-start gap-4 sm:gap-5',
            columnsGrid: 'grid min-w-0 grid-cols-2 gap-x-7 gap-y-8 sm:gap-x-10',
            newsletterSection: [
                'order-2 mt-10 border-t border-white/10 pt-8',
                'sm:mt-11 sm:pt-9 lg:mt-12 lg:pt-10',
            ].join(' '),
            newsletterInner: [
                'flex w-full flex-col gap-5',
                'md:flex-row md:items-end md:justify-between md:gap-10',
            ].join(' '),
            newsletterCopy: 'min-w-0 max-w-md',
            newsletterTitle: 'text-base font-semibold tracking-tight text-white sm:text-lg',
            newsletterDesc: 'mt-2 text-sm leading-6 text-white/75 sm:leading-7',
            newsletterForm: [
                'mt-0 flex w-full max-w-md flex-col gap-2.5',
                'xs:flex-row xs:items-center',
            ].join(' '),
            newsletterInput: [
                'h-11 w-full min-w-0 flex-1 rounded-full border border-white/25 bg-white/10 px-4',
                'text-sm text-white placeholder:text-white/50 outline-none',
                'transition-[border-color,background-color,box-shadow] duration-200',
                'hover:border-white/40 hover:bg-white/10',
                'focus:border-white/50 focus:bg-white/20 focus:ring-2 focus:ring-white/10',
            ].join(' '),
            newsletterButton: [
                'h-11 w-full shrink-0 rounded-full border-0 !bg-white !text-neutral-900 px-6',
                '!normal-case !tracking-normal hover:!bg-white/90 focus-visible:!bg-white/90',
                'xs:w-auto font-semibold',
            ].join(' '),
            bottomBar: [
                'relative z-[1] border-t border-white/10',
                'px-5 py-4 text-center xs:px-6 sm:px-8',
            ].join(' '),
            copyright: 'text-xs leading-5 text-white/70 sm:text-sm',
            accentBar: 'h-1.5 w-full sm:h-2',
            ghostBrand: 'hidden',
        },
    },
    pages: {
        home: {
            hero: {
                section: 'p-0 sm:p-3 md:p-4 lg:p-5',
                banner: [
                    'relative min-h-[560px] overflow-hidden rounded-none bg-cover bg-center bg-no-repeat',
                    'xs:min-h-[600px] sm:min-h-[660px] sm:rounded-[28px]',
                    'md:min-h-[720px] md:rounded-[32px]',
                    'lg:min-h-[780px] xl:min-h-[840px]',
                ].join(' '),
                overlay: [
                    'absolute inset-0',
                    'bg-[linear-gradient(180deg,rgba(0,0,0,0.32)_0%,rgba(0,0,0,0.16)_36%,rgba(0,0,0,0.78)_100%)]',
                    'sm:bg-[linear-gradient(108deg,rgba(0,0,0,0.78)_0%,rgba(0,0,0,0.46)_40%,rgba(0,0,0,0.16)_70%,rgba(0,0,0,0.3)_100%)]',
                ].join(' '),
                main: [
                    'flex min-h-[560px] flex-col justify-end pb-10 pt-[152px]',
                    'xs:min-h-[600px] xs:pb-11 xs:pt-[160px]',
                    'sm:min-h-[660px] sm:pb-12 sm:pt-40',
                    'md:min-h-[720px] md:pb-14 md:pt-44',
                    'lg:min-h-[780px] lg:pb-16 lg:pt-48',
                    'xl:min-h-[840px] xl:pb-20 xl:pt-52',
                ].join(' '),
                content: [
                    'mr-auto w-full max-w-[620px] text-left',
                    'sm:max-w-[700px] lg:max-w-[780px]',
                ].join(' '),
                heading: [
                    'text-[36px] font-semibold leading-[1.04] tracking-[-0.025em]',
                    'xs:text-[40px] sm:text-[48px] sm:leading-[1.01]',
                    'md:text-[54px] lg:text-[62px] xl:text-[68px]',
                ].join(' '),
                paragraph: [
                    'max-w-[32rem] pt-4 text-[15px] font-normal leading-7 text-white/90',
                    'sm:max-w-[34rem] sm:pt-5 sm:text-base sm:leading-7',
                    'lg:max-w-[36rem] xl:text-lg xl:leading-8',
                ].join(' '),
                filtersWrap: [
                    'mr-auto w-full max-w-[980px] pt-8',
                    'sm:pt-9 md:pt-10 lg:max-w-[1040px] lg:pt-12',
                ].join(' '),
                tabsWrap: [
                    'mr-auto mb-3.5 flex flex-wrap items-center justify-start gap-2',
                    'sm:mb-4 sm:gap-2.5',
                ].join(' '),
            },
            heroFilters: {
                form: [
                    'rounded-[24px] border border-white/50 bg-white/95 p-2.5',
                    'shadow-[0_28px_72px_rgba(0,0,0,0.32)] backdrop-blur-xl',
                    'xs:p-3 sm:rounded-[26px] sm:p-3.5',
                    'xl:rounded-[28px] xl:border-[#E8ECEE] xl:p-2 xl:max-w-none',
                ].join(' '),
                field: [
                    'rounded-2xl border-0 bg-neutral-100/95',
                    'xl:rounded-2xl xl:border-0 xl:bg-neutral-50',
                ].join(' '),
                searchButton: '!h-12 !rounded-2xl !font-semibold xl:!h-12 xl:!rounded-2xl',
            },
            sectionHeader: {
                wrap: [
                    'mx-auto max-w-3xl text-center',
                    'md:mx-0 md:max-w-[40rem] md:text-left',
                ].join(' '),
                title: 'agency-section-heading tracking-[-0.02em]',
                eyebrow: 'md:!justify-start',
            },
            tourCard: {
                shell: [
                    'group relative mx-auto flex h-full w-full max-w-[416px] flex-col overflow-hidden',
                    'rounded-[24px] border border-transparent bg-white',
                    'shadow-[0_12px_40px_rgba(0,41,44,0.08)]',
                    'transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_22px_56px_rgba(0,41,44,0.14)]',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hp-color-primary)]/30 focus-visible:ring-offset-2',
                    'sm:rounded-[26px] lg:mx-0',
                ].join(' '),
                imageWrap: 'relative aspect-[16/10] overflow-hidden bg-[#F2F5F6]',
                content: 'flex flex-1 flex-col px-4 py-4 sm:px-5 sm:py-5',
                cta: [
                    'mt-4 inline-flex h-11 w-full items-center justify-center rounded-full text-sm font-semibold text-white',
                    'transition-all duration-300 group-hover:opacity-95 group-hover:brightness-105',
                ].join(' '),
                discountBadge: 'absolute left-3.5 top-3.5 z-10',
                discountPill: [
                    'inline-flex min-w-0 items-center justify-center rounded-full px-3 py-1.5',
                    'font-roboto text-[11px] font-semibold leading-none tracking-wide text-white',
                    'shadow-[0_8px_18px_rgba(0,0,0,0.24)] ring-1 ring-white/30 sm:px-3.5 sm:py-2 sm:text-xs',
                ].join(' '),
                categoryBadge: [
                    'absolute bottom-3.5 left-3.5 rounded-full border-0 bg-white px-2.5 py-1',
                    'text-[10px] font-semibold uppercase tracking-wide text-zinc-800 shadow-md',
                ].join(' '),
                saveShare: 'absolute right-3.5 top-3.5 z-20',
            },
            destinationCard: {
                shell: [
                    'h-auto w-full min-w-0 overflow-hidden rounded-[24px] bg-white p-2.5 pb-3',
                    'shadow-[0_12px_40px_rgba(0,0,0,0.08)]',
                    'transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_52px_rgba(0,0,0,0.12)]',
                    'sm:rounded-[28px] sm:p-3 sm:pb-4',
                ].join(' '),
                image: [
                    'relative h-[180px] w-full overflow-hidden rounded-[18px]',
                    'xs:h-[200px] sm:h-[240px] sm:rounded-[20px] lg:h-[260px]',
                ].join(' '),
                content: 'px-2 pt-3.5 sm:px-2.5 sm:pt-4',
            },
            trust: {
                section: [
                    '-mt-1 overflow-hidden bg-gradient-to-b from-white via-white to-[#F7F9FA]',
                    'pb-2 sm:-mt-3 sm:pb-4',
                ].join(' '),
                header: [
                    'mx-auto max-w-2xl px-1 text-center sm:px-0',
                    'md:mx-0 md:max-w-[34rem] md:text-left',
                ].join(' '),
                title: [
                    'agency-section-heading pt-2.5 text-[24px] font-medium leading-tight tracking-[-0.02em]',
                    'sm:pt-3.5 sm:text-[30px] sm:leading-9 lg:text-[34px] lg:leading-10',
                ].join(' '),
                row: [
                    'mt-7 flex flex-wrap items-center justify-center gap-7 px-4',
                    'sm:mt-9 sm:gap-12 md:justify-start md:gap-14 md:px-0',
                ].join(' '),
            },
            planPerfectTrip: {
                variant: 'classic',
                section: '',
                container: '',
                grid: [
                    'grid grid-cols-1 items-center gap-9',
                    'sm:gap-11 md:grid-cols-2 md:gap-12 lg:gap-16 xl:gap-24',
                ].join(' '),
                media: [
                    'order-1 w-full max-w-[560px] justify-self-center overflow-hidden rounded-[26px]',
                    'ring-1 ring-black/5 shadow-[0_20px_56px_rgba(0,41,44,0.14)]',
                    'sm:max-w-[580px] sm:rounded-[30px] md:order-2 md:justify-self-end',
                ].join(' '),
                image: '',
                copy: 'order-2 w-full max-w-[540px] md:order-1 md:pr-2',
                eyebrow: '',
                title: '',
                paragraph: '',
                stats: [
                    'grid w-full grid-cols-2 gap-x-5 gap-y-6 pt-7',
                    'sm:gap-x-10 sm:gap-y-8 sm:pt-9',
                ].join(' '),
                statCard: '',
            },
            services: {
                section: 'py-12 sm:py-16 md:py-20 lg:py-[108px]',
                header: [
                    'mx-auto max-w-2xl text-center',
                    'md:mx-0 md:max-w-[34rem] md:text-left',
                ].join(' '),
                grid: [
                    'mx-auto grid w-full max-w-[1312px] grid-cols-1 gap-4 pt-8',
                    'sm:gap-5 sm:pt-10 md:grid-cols-2 md:pt-12 lg:gap-6 lg:pt-14',
                ].join(' '),
                card: [
                    'mx-auto flex w-full max-w-[636px] min-h-0 items-center',
                    'rounded-[22px] border border-transparent bg-white px-5 py-5',
                    'shadow-[0_12px_36px_rgba(0,41,44,0.07)]',
                    'transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_48px_rgba(0,41,44,0.12)]',
                    'sm:min-h-[168px] sm:rounded-[24px] sm:px-7 sm:py-6',
                ].join(' '),
            },
            popularDestination: {
                header: [
                    'mx-auto max-w-3xl text-center',
                    'md:mx-0 md:max-w-[40rem] md:text-left',
                ].join(' '),
                listHeader: 'md:text-left md:pt-1',
                carouselWrap: 'overflow-x-hidden pt-6 sm:pt-7 md:pt-8',
            },
            explore: {
                header: [
                    'mx-auto max-w-[900px] px-1 text-center sm:px-0',
                    'md:mx-0 md:max-w-[40rem] md:text-left',
                ].join(' '),
                grid: [
                    'grid grid-cols-1 justify-items-center gap-5 pt-9',
                    'xs:gap-5 sm:grid-cols-2 sm:gap-6 sm:pt-11',
                    'md:pt-12 lg:grid-cols-3 lg:justify-items-stretch lg:gap-7 lg:pt-14',
                ].join(' '),
            },
            gallery: {
                header: [
                    'mx-auto max-w-[900px] px-1 text-center sm:px-0',
                    'md:mx-0 md:max-w-[40rem] md:text-left',
                ].join(' '),
                grid: [
                    'mx-auto mt-7 hidden max-w-[1424px]',
                    'sm:mt-9 sm:grid sm:grid-cols-3 sm:gap-3.5',
                    'lg:mt-5 lg:grid-cols-6 lg:gap-4',
                ].join(' '),
                tile: [
                    'group relative aspect-[229.33/305.77] w-full overflow-hidden rounded-[20px]',
                    'cursor-zoom-in bg-neutral-100 shadow-[0_8px_24px_rgba(0,0,0,0.06)]',
                    'sm:rounded-[22px]',
                    'transition-all duration-300 hover:scale-[1.015] hover:shadow-[0_14px_36px_rgba(0,0,0,0.12)]',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hp-color-primary)] focus-visible:ring-offset-2',
                ].join(' '),
            },
            bookATour: {
                overlay: [
                    'absolute inset-0',
                    'bg-[linear-gradient(125deg,rgba(0,0,0,0.74)_0%,rgba(0,0,0,0.42)_50%,rgba(0,0,0,0.3)_100%)]',
                ].join(' '),
                grid: [
                    'grid grid-cols-1 items-start gap-10',
                    'sm:gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-24',
                ].join(' '),
                copy: 'text-white lg:pr-8 lg:pt-2',
                formPanel: [
                    'min-w-0 overflow-hidden rounded-[26px] border border-white/30 bg-white p-5',
                    'shadow-[0_28px_72px_rgba(0,0,0,0.32)]',
                    'sm:rounded-[30px] sm:p-8',
                ].join(' '),
            },
            team: {
                header: [
                    'mx-auto max-w-3xl text-center',
                    'md:mx-0 md:max-w-[40rem] md:text-left',
                ].join(' '),
                grid: [
                    'grid w-full grid-cols-2 gap-3.5 pt-9',
                    'sm:gap-6 sm:pt-11 lg:grid-cols-4 lg:gap-7 lg:pt-12',
                ].join(' '),
                card: [
                    'h-auto w-full min-w-0 overflow-hidden rounded-[22px] bg-neutral-100',
                    'shadow-[0_12px_36px_rgba(0,0,0,0.08)]',
                    'transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(0,0,0,0.14)]',
                    'sm:rounded-[26px] sm:h-[424px]',
                ].join(' '),
                cardBody: [
                    'h-auto w-full px-3.5 py-4 text-left',
                    'sm:h-[124px] sm:px-5 sm:py-6',
                ].join(' '),
            },
            blogs: {
                header: [
                    'mx-auto max-w-[861px] text-center',
                    'md:mx-0 md:max-w-[40rem] md:text-left',
                ].join(' '),
                grid: [
                    'mx-auto grid grid-cols-1 gap-5 pt-9',
                    'sm:grid-cols-2 sm:gap-6 sm:pt-11 lg:grid-cols-3 lg:gap-7 lg:pt-12',
                ].join(' '),
                card: [
                    'flex h-full w-full min-w-0 flex-col overflow-hidden rounded-[24px] border border-transparent bg-white',
                    'shadow-[0_12px_36px_rgba(0,0,0,0.07)]',
                    'transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_52px_rgba(0,0,0,0.12)]',
                    'sm:rounded-[26px]',
                ].join(' '),
                cardContent: 'flex min-w-0 flex-1 flex-col p-5 sm:p-6',
            },
            testimonials: {
                variant: 'classic',
                header: [
                    'mx-auto max-w-3xl text-center',
                    'md:mx-0 md:max-w-[40rem] md:text-left',
                ].join(' '),
                quote: [
                    'testimonial-quote relative mx-auto w-full max-w-[420px] rounded-[24px]',
                    'px-6 pb-16 pt-9 text-left transition-all duration-300',
                    'shadow-[0_14px_40px_rgba(0,41,44,0.08)]',
                    'hover:shadow-[0_18px_48px_rgba(0,41,44,0.12)]',
                    'sm:rounded-[28px] sm:px-8 sm:pb-[76px] sm:pt-11',
                ].join(' '),
                meta: 'mt-14 text-left sm:mt-16',
            },
        },
        about: {},
    },
}
