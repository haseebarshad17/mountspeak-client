import type { TemplateStyles } from '@/lib/templates/types'

/**
 * Frame — editorial / geometric system.
 * Sharp corners, thick borders, centered rhythm, stronger hover motion.
 * Intentionally unlike Classic (temp-1) and Studio (temp-2).
 */
export const mountTemp3Styles: TemplateStyles = {
    generic: {
        header: {
            shell: 'rounded-none border border-black/10 shadow-none sm:rounded-sm',
        },
        footer: {
            outer: 'bg-[#F0F2F3] px-0 py-0 sm:px-3 sm:py-10 md:py-12',
            shellWrap: 'agency-container px-0 sm:px-4',
            shell: 'relative overflow-hidden rounded-none sm:rounded-lg md:rounded-xl',
            pattern: 'pointer-events-none absolute inset-0 opacity-40',
            content: [
                'relative flex flex-col',
                'px-5 py-10 xs:px-6 sm:px-8 sm:py-11 md:px-10 lg:px-12 lg:py-14',
            ].join(' '),
            mainGrid: [
                'order-1 grid gap-10',
                'lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-start lg:gap-16 xl:gap-24',
            ].join(' '),
            brandBlock: 'flex min-w-0 flex-col items-start gap-5 border-b border-white/15 pb-8 lg:border-b-0 lg:pb-0',
            columnsGrid: 'grid min-w-0 grid-cols-2 gap-x-8 gap-y-8 sm:gap-x-12',
            newsletterSection: [
                'order-2 mt-10 border-t-2 border-white/20 pt-8',
                'sm:mt-12 sm:pt-10',
            ].join(' '),
            newsletterInner: 'grid w-full gap-6 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-12',
            newsletterCopy: 'min-w-0 max-w-xl',
            newsletterTitle: 'text-lg font-semibold tracking-tight text-white sm:text-xl',
            newsletterDesc: 'mt-2 max-w-md text-sm leading-7 text-white/70',
            newsletterForm: 'mt-0 flex w-full max-w-md flex-col gap-2.5 sm:flex-row sm:items-center',
            newsletterInput: [
                'h-12 w-full min-w-0 flex-1 rounded-md border border-white/35 bg-white/10 px-4',
                'text-sm text-white placeholder:text-white/50 outline-none',
                'transition-[border-color,background-color,box-shadow] duration-300',
                'hover:border-white/50 hover:bg-white/[0.12]',
                'focus:border-white/70 focus:bg-white/15 focus:ring-2 focus:ring-white/15',
            ].join(' '),
            newsletterButton: [
                '!inline-flex !h-12 !min-h-12 !w-full !shrink-0 !items-center !justify-center',
                '!rounded-md !border-0 !bg-white !px-8 !text-sm !font-semibold !leading-none',
                '!normal-case !tracking-wide !text-neutral-900',
                'shadow-[0_4px_14px_rgba(0,0,0,0.18)]',
                'transition-all duration-300',
                'hover:!bg-white/95 hover:shadow-[0_8px_20px_rgba(0,0,0,0.22)]',
                'focus-visible:!bg-white focus-visible:ring-2 focus-visible:ring-white/40',
                'sm:!w-auto',
            ].join(' '),
            bottomBar: [
                'relative border-t border-white/15',
                'px-5 py-4 text-left xs:px-6 sm:px-8 md:px-10',
            ].join(' '),
            copyright: 'text-xs leading-5 text-white/65 sm:text-sm',
            accentBar: 'h-2 w-full',
            ghostBrand: 'hidden',
        },
    },
    pages: {
        home: {
            hero: {
                section: 'p-0',
                banner: [
                    'relative min-h-[520px] overflow-hidden rounded-none bg-cover bg-center bg-no-repeat',
                    'xs:min-h-[560px] sm:min-h-[640px] md:min-h-[700px] lg:min-h-[760px] xl:min-h-[820px]',
                ].join(' '),
                overlay: [
                    'absolute inset-0',
                    'bg-[linear-gradient(0deg,rgba(0,0,0,0.82)_0%,rgba(0,0,0,0.35)_42%,rgba(0,0,0,0.45)_100%)]',
                ].join(' '),
                main: [
                    'flex min-h-[520px] flex-col justify-end pb-12 pt-[140px]',
                    'xs:min-h-[560px] xs:pb-14',
                    'sm:min-h-[640px] sm:pb-16 sm:pt-36',
                    'md:min-h-[700px] md:pb-20',
                    'lg:min-h-[760px] lg:pb-24 lg:pt-40',
                    'xl:min-h-[820px] xl:pb-28',
                ].join(' '),
                content: 'mx-auto w-full max-w-[760px] text-center',
                heading: [
                    'text-[32px] font-semibold uppercase leading-[1.05] tracking-[0.04em]',
                    'xs:text-[38px] sm:text-[46px] sm:leading-[1.02]',
                    'md:text-[54px] lg:text-[60px] xl:text-[64px]',
                ].join(' '),
                paragraph: [
                    'mx-auto max-w-[30rem] pt-4 text-[15px] font-normal leading-7 text-white/88',
                    'sm:pt-5 sm:text-base sm:leading-7 lg:max-w-[34rem]',
                ].join(' '),
                filtersWrap: 'mx-auto w-full max-w-[920px] pt-8 sm:pt-10 md:pt-12',
                tabsWrap: 'mx-auto mb-3 flex flex-wrap items-center justify-center gap-2 sm:mb-3.5',
            },
            heroFilters: {
                form: [
                    'rounded-none border-2 border-white/70 bg-white p-2',
                    'shadow-[0_24px_60px_rgba(0,0,0,0.35)]',
                    'sm:p-2.5 xl:border-[#D8DEE0] xl:p-1.5',
                ].join(' '),
                field: 'rounded-none border-0 bg-[#F4F6F7] xl:rounded-none xl:bg-[#F4F6F7]',
                searchButton: '!h-12 !rounded-none !font-semibold uppercase !tracking-wide !text-xs xl:!h-12 xl:!rounded-none',
            },
            sectionHeader: {
                wrap: 'mx-auto max-w-2xl text-center',
                title: 'agency-section-heading uppercase tracking-[0.04em]',
                eyebrow: [
                    '!justify-center gap-4 sm:gap-5',
                    '[&_span:first-child]:!max-w-[88px] [&_span:first-child]:!h-[1px]',
                    '[&_span:last-child]:!max-w-[88px] [&_span:last-child]:!h-[1px]',
                    '[&_span:nth-child(2)]:!tracking-[0.22em] [&_span:nth-child(2)]:!text-[13px]',
                    'sm:[&_span:nth-child(2)]:!text-[15px]',
                ].join(' '),
            },
            tourCard: {
                shell: [
                    'group relative mx-auto flex h-full w-full max-w-[416px] flex-col overflow-hidden',
                    'rounded-2xl border border-[#C9D2D4] bg-white',
                    'shadow-[0_8px_24px_rgba(0,0,0,0.06)]',
                    'transition-all duration-300 ease-out',
                    'hover:-translate-y-1 hover:border-[var(--hp-color-primary)]/40',
                    'hover:shadow-[0_16px_36px_rgba(0,0,0,0.1)]',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hp-color-primary)]/40 focus-visible:ring-offset-2',
                    'lg:mx-0',
                ].join(' '),
                imageWrap: [
                    'relative aspect-[4/3] overflow-hidden bg-[#EEF2F3]',
                    'border-b border-[#C9D2D4]',
                ].join(' '),
                content: 'flex flex-1 flex-col px-4 pb-6 pt-4 sm:px-5 sm:pb-7 sm:pt-5',
                cta: [
                    'mt-5 inline-flex h-11 w-full items-center justify-center rounded-md text-xs font-semibold uppercase tracking-[0.08em] text-white',
                    'mb-1 transition-all duration-300 group-hover:brightness-110',
                    'sm:mt-6',
                ].join(' '),
                discountBadge: 'absolute right-3 top-3 z-10 sm:right-3.5 sm:top-3.5',
                discountPill: [
                    'inline-flex min-w-[68px] items-center justify-center rounded-md px-3 py-1.5',
                    'font-roboto text-[11px] font-bold leading-none tracking-wider text-white uppercase',
                    'shadow-none ring-0 sm:min-w-[76px] sm:px-3.5 sm:text-xs',
                ].join(' '),
                categoryBadge: [
                    'absolute bottom-3 left-3 rounded-md border-0 bg-[var(--hp-color-primary)] px-2.5 py-1.5',
                    'text-[10px] font-bold uppercase tracking-[0.1em] text-white',
                ].join(' '),
                saveShare: 'absolute bottom-3 right-3 z-20',
            },
            destinationCard: {
                shell: [
                    'group relative h-auto w-full min-w-0 overflow-hidden rounded-2xl border border-[#E8EEF0] bg-white p-2.5 pb-3',
                    'shadow-[0_8px_24px_rgba(0,0,0,0.06)]',
                    'transition-all duration-300 ease-out',
                    'hover:-translate-y-1.5 hover:border-[var(--hp-color-primary)]/35',
                    'hover:bg-[#F8FAFC] hover:shadow-[0_16px_36px_rgba(0,0,0,0.1)]',
                    // Explore pill
                    "after:pointer-events-none after:absolute after:right-4 after:top-4 after:z-20",
                    'after:rounded-full after:border after:border-white/50 after:bg-white',
                    'after:px-2.5 after:py-1 after:text-[10px] after:font-semibold after:tracking-wide',
                    'after:text-[var(--hp-color-primary)] after:shadow-[0_4px_12px_rgba(0,0,0,0.12)]',
                    "after:opacity-0 after:content-['Explore_→']",
                    'after:transition-all after:duration-300 group-hover:after:opacity-100',
                ].join(' '),
                image: [
                    'relative !h-auto !aspect-[3/4] w-full overflow-hidden !rounded-[14px] border-0',
                    'xs:!h-auto sm:!h-auto lg:!h-auto',
                    "after:pointer-events-none after:absolute after:inset-0 after:z-[1] after:content-['']",
                    'after:bg-gradient-to-t after:from-black/60 after:via-black/10 after:to-transparent',
                    '[&_img]:origin-center [&_img]:!transition-transform [&_img]:!duration-500 [&_img]:!ease-out',
                    'group-hover:[&_img]:!scale-[1.06]',
                ].join(' '),
                content: [
                    'absolute inset-x-2.5 bottom-3 z-[2] rounded-b-[14px] bg-transparent px-3 pb-3 pt-8 sm:px-3.5 sm:pb-3.5',
                    '[&_h3]:!flex [&_h3]:!items-center [&_h3]:!gap-1.5',
                    '[&_h3]:!text-[16px] [&_h3]:!font-semibold [&_h3]:!leading-6',
                    '[&_h3]:!text-white sm:[&_h3]:!text-[18px]',
                    "[&_h3]:before:content-[''] [&_h3]:before:inline-block",
                    '[&_h3]:before:h-2 [&_h3]:before:w-2 [&_h3]:before:shrink-0',
                    '[&_h3]:before:rounded-full [&_h3]:before:bg-[#C4A574]',
                ].join(' '),
            },
            trust: {
                variant: 'fade',
                section: [
                    'overflow-hidden bg-white py-10',
                    'sm:py-12 lg:py-14',
                ].join(' '),
                header: 'mx-auto max-w-3xl px-1 pb-1 text-center sm:px-0 sm:pb-2',
                title: [
                    'agency-section-heading pt-4 text-[22px] font-bold uppercase leading-tight tracking-[0.06em]',
                    'sm:pt-5 sm:text-[28px] sm:leading-8 sm:tracking-[0.07em]',
                    'lg:text-[32px] lg:leading-9 lg:tracking-[0.08em]',
                ].join(' '),
                row: [
                    'mx-auto mt-8 grid w-full max-w-[1352px] grid-cols-2 items-center justify-items-center gap-x-6 gap-y-8 px-3',
                    'sm:mt-10 sm:grid-cols-3 sm:gap-x-8 sm:gap-y-10 sm:px-4',
                    'md:grid-cols-6 md:gap-x-6 lg:gap-x-10 lg:px-2',
                ].join(' '),
                // No bg box — larger logo slots
                card: [
                    'flex h-[88px] w-[160px] shrink-0 items-center justify-center',
                    'bg-transparent p-0 sm:h-[100px] sm:w-[180px] lg:h-[110px] lg:w-[200px]',
                ].join(' '),
                logo: [
                    'h-16 w-full max-h-[72px] object-contain opacity-70 grayscale',
                    'transition-[opacity,filter] duration-300 ease-out',
                    'hover:opacity-100 hover:grayscale-0',
                    'sm:h-[72px] sm:max-h-20 lg:h-20 lg:max-h-24',
                ].join(' '),
                marquee: '',
            },
            planPerfectTrip: {
                variant: 'showcase',
                section: [
                    'relative',
                    'bg-gradient-to-b from-white to-[#F4FAF9]',
                    // Tight bottom so About sits closer to Services
                    'pt-16 pb-6 sm:pt-20 sm:pb-8 lg:pt-[100px] lg:pb-10',
                ].join(' '),
                container: 'mx-auto w-full max-w-[1280px] px-3 xs:px-4 sm:px-5 md:px-6',
                grid: [
                    'relative grid grid-cols-1 items-center gap-12',
                    'lg:grid-cols-[48%_52%] lg:gap-10 xl:gap-14',
                ].join(' '),
                media: [
                    'group relative w-full max-w-[560px] justify-self-center pb-6',
                    'lg:-ml-2 lg:max-w-none lg:justify-self-stretch lg:pb-4 xl:-ml-4',
                ].join(' '),
                image: [
                    'h-auto w-full object-cover aspect-[4/3] sm:aspect-[5/4]',
                    'rounded-[24px] border-[3px] border-white',
                    'shadow-[0_20px_50px_rgba(0,0,0,0.12)]',
                    '-rotate-2 transition-all duration-500 ease-out',
                    'group-hover:scale-105 group-hover:shadow-[0_28px_64px_rgba(0,0,0,0.18)]',
                ].join(' '),
                copy: 'relative z-[1] w-full max-w-[560px] justify-self-center lg:max-w-none lg:pl-2 xl:pl-4',
                eyebrow: [
                    'inline-flex items-center gap-2 rounded-full px-3.5 py-1.5',
                    'bg-[color-mix(in_srgb,var(--hp-color-primary)_12%,white)]',
                    'text-[11px] font-semibold uppercase tracking-[0.14em]',
                    'sm:text-xs',
                ].join(' '),
                title: [
                    'max-w-[500px] pt-4 text-[36px] font-bold leading-[1.12] tracking-tight',
                    'sm:pt-5 sm:text-[44px] sm:leading-[1.1] lg:text-[56px] lg:leading-[1.08]',
                ].join(' '),
                paragraph: [
                    'max-w-[520px] pt-5 text-sm font-normal leading-7',
                    'sm:pt-6 sm:text-base sm:leading-8',
                ].join(' '),
                stats: [
                    'mt-8 grid w-full grid-cols-2 gap-3',
                    'sm:mt-10 sm:gap-4',
                ].join(' '),
                statCard: [
                    'group/stat flex flex-col gap-1 rounded-2xl bg-[#F8FAFC] p-4',
                    'shadow-[0_4px_16px_rgba(0,0,0,0.06)]',
                    'transition-all duration-300 ease-out',
                    'hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(0,0,0,0.1)]',
                    'sm:gap-1.5 sm:p-5',
                ].join(' '),
            },
            services: {
                // Pull up into homepage flex gap so About → Services has no large empty band
                section: [
                    'bg-white',
                    '-mt-12 pt-8 pb-12',
                    'sm:-mt-16 sm:pt-10 sm:pb-16',
                    'md:-mt-20',
                    'lg:-mt-24 lg:pt-12 lg:pb-20',
                    'xl:-mt-[100px]',
                ].join(' '),
                header: 'mx-auto max-w-2xl text-center',
                grid: [
                    'mx-auto grid w-full max-w-[1312px] grid-cols-1 gap-4 pt-8',
                    'sm:gap-5 sm:pt-10',
                    'md:grid-cols-2 md:gap-5 md:pt-12',
                    'lg:grid-cols-3 lg:gap-6 lg:pt-14',
                    'xl:grid-cols-4',
                ].join(' '),
                card: [
                    // Shell
                    'group relative mx-auto flex h-full w-full min-h-0 flex-col items-stretch',
                    'rounded-2xl border-0 bg-white px-6 py-7',
                    'shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_4px_20px_rgba(0,0,0,0.04)]',
                    'transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
                    'hover:-translate-y-1.5 hover:shadow-[0_0_0_1px_var(--hp-color-primary),0_16px_36px_rgba(0,0,0,0.08)]',
                    'sm:min-h-0 sm:px-6 sm:py-7',
                    // Stack icon above text; kill horizontal / right-align layout
                    '[&>div]:!flex [&>div]:!w-full [&>div]:!flex-col [&>div]:!items-start [&>div]:!gap-4',
                    '[&>div>div]:!order-none',
                    '[&>div>div:last-child]:!text-left',
                    // Icon badge
                    [
                        '[&>div>div:first-child]:!relative [&>div>div:first-child]:!mb-1',
                        '[&>div>div:first-child]:!flex [&>div>div:first-child]:!h-12 [&>div>div:first-child]:!w-12',
                        '[&>div>div:first-child]:!shrink-0 [&>div>div:first-child]:!items-center',
                        '[&>div>div:first-child]:!justify-center [&>div>div:first-child]:!rounded-xl',
                        '[&>div>div:first-child]:!bg-[color-mix(in_srgb,var(--hp-color-primary)_12%,white)]',
                        '[&>div>div:first-child]:transition-colors [&>div>div:first-child]:duration-300',
                        'group-hover:[&>div>div:first-child]:!bg-[color-mix(in_srgb,var(--hp-color-primary)_22%,white)]',
                        '[&>div>div:first-child_img]:!h-6 [&>div>div:first-child_img]:!w-6',
                        '[&>div>div:first-child_img]:!object-contain sm:[&>div>div:first-child]:!h-14',
                        'sm:[&>div>div:first-child]:!w-14 sm:[&>div>div:first-child_img]:!h-7',
                        'sm:[&>div>div:first-child_img]:!w-7',
                    ].join(' '),
                    // Typography polish
                    [
                        '[&_h3]:!pb-2 [&_h3]:!text-[17px] [&_h3]:!font-bold [&_h3]:!leading-snug',
                        'sm:[&_h3]:!pb-2.5 sm:[&_h3]:!text-[18px] sm:[&_h3]:!leading-6',
                        '[&_p]:!pt-0 [&_p]:!text-[14px] [&_p]:!leading-[1.6]',
                        'sm:[&_p]:!pt-0 sm:[&_p]:!text-[15px] sm:[&_p]:!leading-[1.65]',
                    ].join(' '),
                    // Learn more cue
                    [
                        "after:mt-5 after:inline-flex after:items-center after:gap-1.5",
                        "after:text-[13px] after:font-semibold after:tracking-wide",
                        'after:text-[var(--hp-color-primary)] after:content-["Learn_more_→"]',
                        'after:transition-transform after:duration-300 after:ease-out',
                        'group-hover:after:translate-x-1',
                    ].join(' '),
                ].join(' '),
            },
            popularDestination: {
                header: 'mx-auto max-w-3xl text-center',
                listHeader: [
                    'relative mx-auto max-w-2xl pt-2 text-center',
                    '[&>span]:!text-xs [&>span]:!font-semibold [&>span]:!uppercase',
                    '[&>span]:!tracking-[0.2em] [&>span]:!text-[var(--hp-color-primary)]',
                    'sm:[&>span]:!text-sm',
                    '[&>h2]:!pt-2 [&>h2]:!text-[30px] [&>h2]:!font-semibold',
                    '[&>h2]:!tracking-tight sm:[&>h2]:!text-[36px] lg:[&>h2]:!text-[40px]',
                ].join(' '),
                carouselWrap: [
                    // overflow-visible so full round arrows are not clipped
                    'relative overflow-visible pt-5 sm:pt-6 lg:pt-8',
                    // Equal side gutters for arrows (override TopDestinations lg:pl-0 lg:pr-14)
                    '[&>div]:!overflow-visible [&>div]:!px-0 lg:[&>div]:!px-14',
                    // Keep slide track clipped, not the arrow layer
                    '[&_.swiper]:!overflow-hidden',
                    // Full circle arrows sitting in the side gutters
                    '[&_button]:!top-1/2 [&_button]:!-translate-y-1/2 [&_button]:!z-20',
                    '[&_button]:!inline-flex [&_button]:!h-11 [&_button]:!w-11',
                    '[&_button]:!shrink-0 [&_button]:!rounded-full',
                    '[&_button.left-0]:!left-1 lg:[&_button.left-0]:!left-0',
                    '[&_button.right-0]:!right-1 lg:[&_button.right-0]:!right-0',
                    '[&_button]:!border [&_button]:!border-[#E5EBF0] [&_button]:!bg-white',
                    '[&_button]:!text-[var(--hp-color-primary)]',
                    '[&_button]:!shadow-[0_8px_20px_rgba(0,0,0,0.1)]',
                    '[&_button]:hover:!border-[var(--hp-color-primary)]/40 [&_button]:hover:!bg-[#F8FAFC]',
                    '[&_button]:hover:!shadow-[0_12px_24px_rgba(0,0,0,0.12)]',
                    '[&_button]:disabled:!opacity-30',
                ].join(' '),
            },
            explore: {
                header: 'mx-auto max-w-[900px] px-1 text-center sm:px-0',
                grid: [
                    'grid grid-cols-1 justify-items-center gap-5 pt-9',
                    'xs:gap-5 sm:grid-cols-2 sm:gap-6 sm:pt-11',
                    'md:pt-12 lg:grid-cols-3 lg:justify-items-stretch lg:gap-6 lg:pt-14',
                ].join(' '),
            },
            gallery: {
                header: 'mx-auto max-w-[900px] px-1 text-center sm:px-0',
                grid: [
                    'mx-auto mt-7 hidden max-w-[1424px]',
                    'sm:mt-9 sm:grid sm:grid-cols-3 sm:gap-3',
                    'lg:mt-6 lg:grid-cols-6 lg:gap-3',
                ].join(' '),
                tile: [
                    'group relative aspect-[229.33/305.77] w-full overflow-hidden rounded-none',
                    'cursor-zoom-in border-2 border-transparent bg-neutral-100',
                    'transition-all duration-500 ease-out',
                    'hover:z-10 hover:scale-[1.04] hover:border-[var(--hp-color-primary)] hover:shadow-[6px_6px_0_0_rgba(0,41,44,0.2)]',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hp-color-primary)] focus-visible:ring-offset-2',
                ].join(' '),
            },
            bookATour: {
                overlay: [
                    'absolute inset-0',
                    'bg-[linear-gradient(180deg,rgba(0,0,0,0.7)_0%,rgba(0,0,0,0.5)_55%,rgba(0,0,0,0.75)_100%)]',
                ].join(' '),
                grid: [
                    'grid grid-cols-1 items-start gap-10',
                    'sm:gap-12 lg:grid-cols-2 lg:gap-14 xl:gap-20',
                ].join(' '),
                copy: 'text-white text-center lg:text-left lg:pr-6',
                formPanel: [
                    'min-w-0 overflow-hidden rounded-none border-2 border-white/40 bg-white p-5',
                    'shadow-[12px_12px_0_0_rgba(0,0,0,0.35)]',
                    'sm:p-7 md:p-8',
                ].join(' '),
            },
            team: {
                header: 'mx-auto max-w-3xl text-center',
                grid: [
                    'mx-auto grid max-w-[1200px] grid-cols-2 gap-3 pt-9',
                    'sm:gap-5 sm:pt-11 lg:grid-cols-4 lg:gap-6 lg:pt-12',
                ].join(' '),
                card: [
                    'group h-auto w-full overflow-hidden rounded-none border-2 border-[#D5DADD] bg-neutral-100',
                    'shadow-none transition-all duration-500 ease-out',
                    'hover:-translate-y-2 hover:border-[var(--hp-color-primary)] hover:shadow-[6px_6px_0_0_var(--hp-color-primary)]',
                    'sm:h-[424px]',
                ].join(' '),
                cardBody: [
                    'h-auto border-t-2 border-[#D5DADD] px-3 py-4 text-center',
                    'transition-colors duration-500 group-hover:border-[var(--hp-color-primary)]',
                    'sm:h-[124px] sm:px-5 sm:py-6',
                ].join(' '),
            },
            blogs: {
                header: 'mx-auto max-w-[861px] text-center',
                grid: [
                    'mx-auto grid grid-cols-1 gap-5 pt-9',
                    'sm:grid-cols-2 sm:gap-6 sm:pt-11 lg:grid-cols-3 lg:gap-6 lg:pt-12',
                ].join(' '),
                card: [
                    'group flex h-full w-full min-w-0 flex-col overflow-hidden rounded-none',
                    'border-2 border-[#D5DADD] bg-white shadow-none',
                    'transition-all duration-500 ease-out',
                    'hover:-translate-y-2 hover:border-[var(--hp-color-primary)] hover:shadow-[8px_8px_0_0_rgba(0,41,44,0.12)]',
                ].join(' '),
                cardContent: 'flex min-w-0 flex-1 flex-col border-t-2 border-[#E3E8EA] p-5 sm:p-6',
            },
            testimonials: {
                variant: 'premium',
                section: [
                    'overflow-hidden bg-[#F7F9FA]',
                    'pt-10 sm:pt-14 lg:pt-16',
                ].join(' '),
                header: 'mx-auto max-w-3xl text-center',
                carouselWrap: [
                    'relative overflow-visible pt-2 sm:pt-3',
                    '[&>div]:!overflow-visible [&>div]:!px-12 lg:[&>div]:!px-14',
                    '[&_.swiper]:!overflow-hidden',
                    // Equal clickable arrows
                    '[&_button]:!top-1/2 [&_button]:!-translate-y-1/2 [&_button]:!z-20',
                    '[&_button]:!inline-flex [&_button]:!h-11 [&_button]:!w-11',
                    '[&_button]:!shrink-0 [&_button]:!items-center [&_button]:!justify-center',
                    '[&_button]:!rounded-full [&_button]:!p-0',
                    '[&_button.left-0]:!left-0 [&_button.right-0]:!right-0',
                    '[&_button]:!border [&_button]:!border-[#E5EBF0] [&_button]:!bg-white',
                    '[&_button]:!text-[var(--hp-color-primary)]',
                    '[&_button]:!shadow-[0_8px_20px_rgba(0,0,0,0.1)]',
                    '[&_button]:hover:!border-[var(--hp-color-primary)]/40 [&_button]:hover:!bg-[#F8FAFC]',
                    '[&_button]:hover:!shadow-[0_12px_24px_rgba(0,0,0,0.12)]',
                    '[&_button]:disabled:!opacity-30 [&_button]:disabled:!pointer-events-none',
                ].join(' '),
                quote: [
                    'group relative flex h-full min-h-[280px] w-full flex-col',
                    'rounded-2xl border border-[#E8EEF0] bg-white p-6 sm:min-h-[300px] sm:p-7',
                    'shadow-[0_8px_24px_rgba(0,0,0,0.06)]',
                    'transition-all duration-300 ease-out',
                    'hover:-translate-y-1 hover:border-[var(--hp-color-primary)]/25',
                    'hover:shadow-[0_16px_36px_rgba(0,0,0,0.1)]',
                ].join(' '),
                meta: 'mt-auto border-t border-[#E8EEF0] pt-4',
            },
        },
        about: {},
    },
}
