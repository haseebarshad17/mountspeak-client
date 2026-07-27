'use client'

import { HP_CSS_VARS, STATIC_UI_COLORS } from '@/data/homepage'
import type { HomepagePageProps } from '@/components/pages/marketing/home/homepage-section.types'
import { useTemplateStyles } from '@/components/providers/TemplateStylesProvider'
import { HomepageMediaImage } from '@/components/ui/homepage-media-image'
import { cn } from '@/lib/utils/clsxUtils'
import { Car, Hotel, MapPin, Plane, Star, type LucideIcon } from 'lucide-react'
import { motion, useInView, useMotionValue, useSpring } from 'motion/react'
import React, { useEffect, useRef, useState } from 'react'

const STAT_ICONS: LucideIcon[] = [Plane, Hotel, Car, MapPin]

function resolveStatIcon(label: string, index: number): LucideIcon {
    const key = label.toLowerCase()
    if (key.includes('flight') || key.includes('destination')) return Plane
    if (key.includes('hotel')) return Hotel
    if (key.includes('transport') || key.includes('car')) return Car
    if (key.includes('place') || key.includes('dream') || key.includes('map')) return MapPin
    return STAT_ICONS[index % STAT_ICONS.length]
}

function parseStatValue(raw: string): { target: number; suffix: string; prefix: string } {
    const match = raw.trim().match(/^([^0-9]*)(\d+(?:\.\d+)?)(.*)$/)
    if (!match) return { target: 0, suffix: raw, prefix: '' }
    return {
        prefix: match[1] ?? '',
        target: Number(match[2]),
        suffix: match[3] ?? '',
    }
}

function highlightTitle(title: string) {
    const words = title.split(/\s+/)
    if (words.length < 2) return title

    const highlightIndex = words.findIndex((word) => /perfect|trip|dream|adventure/i.test(word))
    const index = highlightIndex >= 0 ? highlightIndex : Math.min(1, words.length - 1)

    return words.map((word, i) =>
        i === index ? (
            <span key={`${word}-${i}`} style={{ color: HP_CSS_VARS.primary }}>
                {word}
                {i < words.length - 1 ? ' ' : ''}
            </span>
        ) : (
            <React.Fragment key={`${word}-${i}`}>
                {word}
                {i < words.length - 1 ? ' ' : ''}
            </React.Fragment>
        ),
    )
}

function AnimatedStatValue({ value, active }: { value: string; active: boolean }) {
    const { target, suffix, prefix } = parseStatValue(value)
    const motionValue = useMotionValue(0)
    const spring = useSpring(motionValue, { stiffness: 55, damping: 20 })
    const [display, setDisplay] = useState(0)

    useEffect(() => {
        if (!active) {
            motionValue.set(0)
            return
        }
        motionValue.set(0)
        const id = requestAnimationFrame(() => motionValue.set(target))
        return () => cancelAnimationFrame(id)
    }, [active, motionValue, target])

    useEffect(() => {
        return spring.on('change', (latest) => {
            setDisplay(Math.round(latest))
        })
    }, [spring])

    return (
        <span>
            {prefix}
            {display}
            {suffix}
        </span>
    )
}

function ShowcasePlanPerfectTrip({ page }: HomepagePageProps) {
    const section = page.sections.planPerfectTrip
    const styles = useTemplateStyles().pages.home.planPerfectTrip
    const rootRef = useRef<HTMLElement>(null)
    const inView = useInView(rootRef, { once: true, amount: 0.25 })

    return (
        <section
            ref={rootRef}
            aria-labelledby='plan-perfect-trip-heading'
            className={cn(styles.section)}
        >
            <div className='pointer-events-none absolute inset-0 overflow-hidden' aria-hidden>
                <div className='absolute -left-16 top-10 h-64 w-64 rounded-full bg-[var(--hp-color-primary)] opacity-[0.05] blur-3xl' />
                <div className='absolute -right-20 bottom-8 h-72 w-72 rounded-full bg-[var(--hp-color-primary)] opacity-[0.05] blur-3xl' />
                <Plane className='absolute right-[8%] top-[18%] h-16 w-16 rotate-12 text-[var(--hp-color-primary)] opacity-[0.05]' />
                <MapPin className='absolute bottom-[22%] left-[6%] h-12 w-12 text-[var(--hp-color-primary)] opacity-[0.05]' />
                <div
                    className='absolute inset-0 opacity-[0.04]'
                    style={{
                        backgroundImage:
                            'radial-gradient(circle at 1px 1px, var(--hp-color-primary) 1px, transparent 0)',
                        backgroundSize: '28px 28px',
                        maskImage:
                            'radial-gradient(ellipse 70% 60% at 50% 50%, black 20%, transparent 75%)',
                    }}
                />
            </div>

            <div className={cn(styles.container || 'agency-container')}>
                <div className={cn(styles.grid)}>
                    <motion.div
                        className={cn(styles.media)}
                        initial={{ opacity: 0, x: -48 }}
                        animate={inView ? { opacity: 1, x: 0 } : undefined}
                        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <div
                            className='pointer-events-none absolute -inset-6 rounded-[32px] opacity-70 blur-2xl sm:-inset-8'
                            style={{
                                background:
                                    'radial-gradient(ellipse at center, color-mix(in srgb, var(--hp-color-primary) 35%, transparent), transparent 70%)',
                            }}
                            aria-hidden
                        />

                        <div className='relative'>
                            <HomepageMediaImage
                                src={section.image.src}
                                alt={section.image.alt}
                                width={640}
                                height={520}
                                className={cn(styles.image)}
                            />

                            <motion.div
                                className={[
                                    'absolute -right-2 top-4 z-10 sm:-right-3 sm:top-6',
                                    'inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-2',
                                    'text-[11px] font-semibold tracking-wide',
                                    'shadow-[0_10px_28px_rgba(0,0,0,0.12)] ring-1 ring-black/5',
                                    'transition-transform duration-500 group-hover:-translate-y-1.5',
                                    'sm:px-3.5 sm:text-xs',
                                ].join(' ')}
                                style={{ color: STATIC_UI_COLORS.title }}
                                initial={{ opacity: 0, y: 8 }}
                                animate={inView ? { opacity: 1, y: 0 } : undefined}
                                transition={{ delay: 0.35, duration: 0.45 }}
                            >
                                <Plane
                                    className='h-3.5 w-3.5 shrink-0 transition-transform duration-300 group-hover:rotate-12'
                                    style={{ color: HP_CSS_VARS.primary }}
                                    aria-hidden
                                />
                                Travel Since 2015
                            </motion.div>

                            <motion.div
                                className={[
                                    'absolute -bottom-3 left-2 z-10 sm:-bottom-4 sm:left-4',
                                    'rounded-2xl bg-white px-3.5 py-3',
                                    'shadow-[0_12px_32px_rgba(0,0,0,0.12)] ring-1 ring-black/5',
                                    'transition-transform duration-500 group-hover:-translate-y-2',
                                    'sm:px-4 sm:py-3.5',
                                ].join(' ')}
                                initial={{ opacity: 0, y: 12 }}
                                animate={inView ? { opacity: 1, y: 0 } : undefined}
                                transition={{ delay: 0.45, duration: 0.45 }}
                            >
                                <div
                                    className='flex items-center gap-1.5 text-sm font-semibold'
                                    style={{ color: STATIC_UI_COLORS.title }}
                                >
                                    <Star
                                        className='h-4 w-4 fill-[#F5D547] text-[#F5D547] transition-transform duration-300 group-hover:rotate-12'
                                        aria-hidden
                                    />
                                    4.9 Rating
                                </div>
                                <p
                                    className='pt-0.5 text-[11px] font-medium sm:text-xs'
                                    style={{ color: STATIC_UI_COLORS.textMuted }}
                                >
                                    10K+ Happy Travelers
                                </p>
                            </motion.div>
                        </div>
                    </motion.div>

                    <motion.div
                        className={cn(styles.copy)}
                        initial={{ opacity: 0, x: 48 }}
                        animate={inView ? { opacity: 1, x: 0 } : undefined}
                        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
                    >
                        <motion.span
                            className={cn(styles.eyebrow)}
                            style={{ color: HP_CSS_VARS.primary, fontFamily: 'var(--hp-font-body)' }}
                            initial={{ opacity: 0, y: 12 }}
                            animate={inView ? { opacity: 1, y: 0 } : undefined}
                            transition={{ delay: 0.15, duration: 0.45 }}
                        >
                            <MapPin className='h-3.5 w-3.5 shrink-0' aria-hidden />
                            {section.eyebrow}
                        </motion.span>

                        <motion.h2
                            id='plan-perfect-trip-heading'
                            className={cn(styles.title)}
                            style={{
                                color: STATIC_UI_COLORS.title,
                                fontFamily: 'var(--hp-font-heading)',
                            }}
                            initial={{ opacity: 0, y: 18 }}
                            animate={inView ? { opacity: 1, y: 0 } : undefined}
                            transition={{ delay: 0.22, duration: 0.5 }}
                        >
                            {highlightTitle(section.title)}
                        </motion.h2>

                        <motion.p
                            className={cn(styles.paragraph)}
                            style={{ color: STATIC_UI_COLORS.text, fontFamily: 'var(--hp-font-body)' }}
                            initial={{ opacity: 0, y: 14 }}
                            animate={inView ? { opacity: 1, y: 0 } : undefined}
                            transition={{ delay: 0.32, duration: 0.5 }}
                        >
                            {section.paragraph}
                        </motion.p>

                        <dl className={cn(styles.stats)}>
                            {section.stats.map((item, index) => {
                                const Icon = resolveStatIcon(item.label, index)
                                return (
                                    <motion.div
                                        key={`${item.value}-${item.label}`}
                                        className={cn(styles.statCard)}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={inView ? { opacity: 1, y: 0 } : undefined}
                                        transition={{
                                            delay: 0.4 + index * 0.1,
                                            duration: 0.45,
                                            ease: [0.22, 1, 0.36, 1],
                                        }}
                                    >
                                        <Icon
                                            className='h-4 w-4 transition-transform duration-300 group-hover/stat:rotate-12 sm:h-[18px] sm:w-[18px]'
                                            style={{ color: HP_CSS_VARS.primary }}
                                            aria-hidden
                                        />
                                        <dt
                                            className='text-2xl font-bold leading-none tracking-tight sm:text-[28px]'
                                            style={{
                                                color: HP_CSS_VARS.primary,
                                                fontFamily: 'var(--hp-font-heading)',
                                            }}
                                        >
                                            <AnimatedStatValue value={item.value} active={inView} />
                                        </dt>
                                        <dd
                                            className='text-xs font-medium leading-snug sm:text-sm'
                                            style={{
                                                color: STATIC_UI_COLORS.text,
                                                fontFamily: 'var(--hp-font-body)',
                                            }}
                                        >
                                            {item.label}
                                        </dd>
                                    </motion.div>
                                )
                            })}
                        </dl>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

function ClassicPlanPerfectTrip({ page }: HomepagePageProps) {
    const section = page.sections.planPerfectTrip
    const styles = useTemplateStyles().pages.home.planPerfectTrip

    return (
        <section aria-labelledby='plan-perfect-trip-heading' className={cn(styles.section)}>
            <div className={cn(styles.container || 'agency-container')}>
                <div className={cn(styles.grid)}>
                    <div className={cn(styles.media)}>
                        <HomepageMediaImage
                            src={section.image.src}
                            alt={section.image.alt}
                            width={580}
                            height={448}
                            className={cn(
                                'h-max w-full max-w-[580px] object-cover',
                                styles.image,
                            )}
                        />
                    </div>

                    <div className={cn(styles.copy)}>
                        <span
                            className={cn(
                                'text-sm font-semibold uppercase tracking-[0.12em] sm:text-base',
                                styles.eyebrow,
                            )}
                            style={{ color: HP_CSS_VARS.primary, fontFamily: 'var(--hp-font-body)' }}
                        >
                            {section.eyebrow}
                        </span>

                        <h2
                            id='plan-perfect-trip-heading'
                            className={cn('agency-section-heading pt-1', styles.title)}
                            style={{
                                color: STATIC_UI_COLORS.title,
                                fontFamily: 'var(--hp-font-heading)',
                            }}
                        >
                            {section.title}
                        </h2>

                        <p
                            className={cn(
                                'pt-4 text-sm font-normal leading-6 sm:pt-5 sm:text-base',
                                styles.paragraph,
                            )}
                            style={{ color: STATIC_UI_COLORS.text, fontFamily: 'var(--hp-font-body)' }}
                        >
                            {section.paragraph}
                        </p>

                        <dl className={cn(styles.stats)}>
                            {section.stats.map((item) => (
                                <div key={`${item.value}-${item.label}`} className={cn(styles.statCard)}>
                                    <dt
                                        className='text-2xl font-semibold leading-none sm:text-[28px]'
                                        style={{
                                            color: HP_CSS_VARS.primary,
                                            fontFamily: 'var(--hp-font-heading)',
                                        }}
                                    >
                                        {item.value}
                                    </dt>
                                    <dd
                                        className='pt-1 text-sm font-normal sm:text-base'
                                        style={{
                                            color: STATIC_UI_COLORS.text,
                                            fontFamily: 'var(--hp-font-body)',
                                        }}
                                    >
                                        {item.label}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </div>
            </div>
        </section>
    )
}

const PlanPerfectTrip = ({ page }: HomepagePageProps) => {
    const variant = useTemplateStyles().pages.home.planPerfectTrip.variant

    if (variant === 'showcase') {
        return <ShowcasePlanPerfectTrip page={page} />
    }

    return <ClassicPlanPerfectTrip page={page} />
}

export default PlanPerfectTrip
