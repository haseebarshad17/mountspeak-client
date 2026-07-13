'use client'

import { Button } from '@/components/ui/button'
import { PageHeroBanner, PAGE_HERO_CONTENT_CLASS } from '@/components/ui/page-hero-banner'
import { SectionEmptyState } from '@/components/ui/section-empty-state'
import {
    HP_THEME_BG_CLASS,
    HP_THEME_TEXT_CLASS,
} from '@/data/homepage'
import { useHeroBackgroundImage } from '@/hooks/useHeroBackgroundImage'
import { useIsAgencySite } from '@/hooks/useIsAgencySite'
import { cn } from '@/lib/utils/clsxUtils'
import { useAgencyAbout } from '@/services/content_pages/content.queries'
import type { AboutUsDocument } from '@/services/content_pages/content.type'
import { selectHomepageAgencyId } from '@/store/homepage/homepage.selectors'
import { useAppSelector } from '@/store/hooks'
import { Building2, Compass, MapPin, ShieldCheck, Users } from 'lucide-react'
import type { CSSProperties } from 'react'

const valueIcons = {
    map: Compass,
    shield: ShieldCheck,
    location: MapPin,
    users: Users,
} as const

const aboutCardClassName = 'rounded-xl border bg-white'

const aboutThemeBorderStyle: CSSProperties = {
    borderColor: 'color-mix(in srgb, var(--hp-color-primary) 35%, white)',
}

function resolveAboutHref(url: string) {
    if (url === '/tours') return '/search'
    if (url === '/contact') return '/contact-us'
    return url
}

function AboutSkeleton() {
    return (
        <div className='agency-container animate-pulse space-y-10 py-16' aria-hidden>
            <div className='mx-auto h-10 w-1/2 rounded bg-neutral-200' />
            <div className='mx-auto space-y-3'>
                <div className='h-4 w-full rounded bg-neutral-200' />
                <div className='h-4 w-[90%] rounded bg-neutral-200' />
            </div>
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className='h-28 rounded-xl bg-neutral-200' />
                ))}
            </div>
        </div>
    )
}

function AboutContent({ about }: { about: AboutUsDocument }) {
    const backgroundImage = useHeroBackgroundImage()
    const heroTitle = about.hero?.title || about.meta?.title || 'About Us'
    const heroSubtitle = about.hero?.subtitle
    const values = about.values?.items ?? []
    const stats = about.statistics ?? []
    const ctaButtons = about.cta?.buttons ?? []

    return (
        <>
            <PageHeroBanner backgroundImage={backgroundImage} fixedHeight>
                <div className={PAGE_HERO_CONTENT_CLASS}>
                    <h1 className='text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl xl:text-[45px]'>
                        {heroTitle}
                    </h1>
                    {heroSubtitle ? (
                        <p className='mx-auto mt-4 max-w-[640px] text-sm leading-6 text-white/90 sm:text-base xl:text-lg'>
                            {heroSubtitle}
                        </p>
                    ) : null}
                </div>
            </PageHeroBanner>

            <main className='pb-20 pt-16 sm:pt-20 lg:pt-[100px]'>
                <div className='agency-container space-y-16 sm:space-y-20'>
                    {about.mission ? (
                        <section className='mx-auto max-w-[820px] px-0 text-center'>
                            <h2 className='text-[32px] font-medium leading-tight text-[#14141F] sm:text-[40px]'>
                                {about.mission.title}
                            </h2>
                            <div className='mt-6 space-y-4 text-left sm:text-center'>
                                {about.mission.description.map((paragraph) => (
                                    <p key={paragraph} className='text-base leading-6 text-neutral-600'>
                                        {paragraph}
                                    </p>
                                ))}
                            </div>
                        </section>
                    ) : null}

                    {stats.length > 0 ? (
                        <section className='mx-auto max-w-[820px] px-0'>
                            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
                                {stats.map((stat) => (
                                    <div
                                        key={stat.id}
                                        className={cn(aboutCardClassName, 'px-6 py-8 text-center')}
                                        style={aboutThemeBorderStyle}
                                    >
                                        <p
                                            className={cn(
                                                'text-3xl font-semibold sm:text-4xl',
                                                HP_THEME_TEXT_CLASS,
                                            )}
                                        >
                                            {stat.value}
                                        </p>
                                        <p className='mt-2 text-sm text-neutral-600'>{stat.label}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    ) : null}

                    {about.values ? (
                        <section className='mx-auto max-w-[820px] px-0'>
                            <div className='mx-auto max-w-[700px] text-center'>
                                <h2 className='text-[32px] font-medium leading-tight text-[#14141F] sm:text-[40px]'>
                                    {about.values.title}
                                </h2>
                            </div>
                            <div className='mt-10 grid gap-6 sm:grid-cols-2'>
                                {values.map((value) => {
                                    const Icon =
                                        valueIcons[value.icon as keyof typeof valueIcons] ?? Compass
                                    return (
                                        <article
                                            key={value.id}
                                            className={cn(aboutCardClassName, 'p-6 sm:p-8')}
                                            style={aboutThemeBorderStyle}
                                        >
                                            <div className='flex items-center gap-3'>
                                                <Icon
                                                    className={cn(
                                                        'h-7 w-7 shrink-0 stroke-[1.75]',
                                                        HP_THEME_TEXT_CLASS,
                                                    )}
                                                    aria-hidden
                                                />
                                                <h3
                                                    className={cn(
                                                        'text-lg font-semibold leading-snug sm:text-xl',
                                                        HP_THEME_TEXT_CLASS,
                                                    )}
                                                >
                                                    {value.title}
                                                </h3>
                                            </div>
                                            <p className='mt-4 text-sm leading-6 text-neutral-600 sm:text-base'>
                                                {value.description}
                                            </p>
                                        </article>
                                    )
                                })}
                            </div>
                        </section>
                    ) : null}

                    {about.aboutCompany ? (
                        <section className='mx-auto max-w-[820px] px-0'>
                            <div
                                className={cn(aboutCardClassName, 'px-6 py-10 sm:px-10 sm:py-12')}
                                style={aboutThemeBorderStyle}
                            >
                                <h2 className='text-center text-[32px] font-medium leading-tight text-[#14141F] sm:text-[40px]'>
                                    {about.aboutCompany.title}
                                </h2>
                                <div className='mt-6 space-y-4'>
                                    {about.aboutCompany.description.map((paragraph) => (
                                        <p
                                            key={paragraph}
                                            className='text-base leading-6 text-neutral-600'
                                        >
                                            {paragraph}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        </section>
                    ) : null}

                    {about.cta ? (
                        <section className='mx-auto max-w-[820px] px-0'>
                            <div
                                className={cn(
                                    'rounded-xl border px-6 py-12 text-center text-white sm:px-10 sm:py-14',
                                    HP_THEME_BG_CLASS,
                                )}
                                style={aboutThemeBorderStyle}
                            >
                                <h2 className='text-2xl font-semibold sm:text-3xl'>{about.cta.title}</h2>
                                {about.cta.subtitle ? (
                                    <p className='mx-auto mt-3 max-w-[560px] text-sm leading-6 text-white/85 sm:text-base'>
                                        {about.cta.subtitle}
                                    </p>
                                ) : null}
                                {ctaButtons.length > 0 ? (
                                    <div className='mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row'>
                                        {ctaButtons.map((button) => (
                                            <Button
                                                key={button.id}
                                                href={resolveAboutHref(button.url)}
                                                variant={
                                                    button.variant === 'secondary'
                                                        ? 'outline-on-dark'
                                                        : 'hero-outline'
                                                }
                                                className={cn(
                                                    'min-w-[200px]',
                                                    button.variant === 'secondary'
                                                        ? 'border-white/40 hover:bg-white/10'
                                                        : cn(
                                                              '!border-white !bg-white hover:!border-white hover:!bg-white/90',
                                                              HP_THEME_TEXT_CLASS,
                                                          ),
                                                )}
                                            >
                                                {button.text}
                                            </Button>
                                        ))}
                                    </div>
                                ) : null}
                            </div>
                        </section>
                    ) : null}
                </div>
            </main>
        </>
    )
}

export default function AboutUsPage() {
    const isAgencySite = useIsAgencySite()
    const agencyId = useAppSelector(selectHomepageAgencyId)
    const backgroundImage = useHeroBackgroundImage()
    const { data: about = null, isLoading } = useAgencyAbout(agencyId, isAgencySite === true)

    if (isLoading || isAgencySite === null) {
        return (
            <>
                <PageHeroBanner backgroundImage={backgroundImage} fixedHeight>
                    <div className={PAGE_HERO_CONTENT_CLASS}>
                        <div className='mx-auto h-10 w-2/3 max-w-md animate-pulse rounded bg-white/30' />
                    </div>
                </PageHeroBanner>
                <AboutSkeleton />
            </>
        )
    }

    if (!about) {
        return (
            <main className='bg-[#F7F8FA] pb-20 pt-28'>
                <div className='agency-container'>
                    <SectionEmptyState
                        icon={Building2}
                        title='About unavailable'
                        description='About Us content for this agency has not been published yet.'
                    />
                </div>
            </main>
        )
    }

    return <AboutContent about={about} />
}
