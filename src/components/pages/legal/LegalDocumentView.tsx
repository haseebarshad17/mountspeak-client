'use client'

import { SectionEmptyState } from '@/components/ui/section-empty-state'
import { HP_CSS_VARS, STATIC_UI_COLORS } from '@/data/homepage'
import type { LegalDocument, LegalSection } from '@/services/content_pages/content.type'
import { FileText } from 'lucide-react'
import type { ReactNode } from 'react'

function formatLegalDate(value: string | undefined): string | null {
    if (!value) return null

    const date = new Date(`${value}T00:00:00`)
    if (Number.isNaN(date.getTime())) return value

    return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    })
}

function linkifyText(text: string): ReactNode[] {
    const parts = text.split(
        /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|https?:\/\/[^\s]+|www\.[^\s]+)/g,
    )

    return parts.filter(Boolean).map((part, index) => {
        if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(part)) {
            return (
                <a
                    key={`${part}-${index}`}
                    href={`mailto:${part}`}
                    className='underline underline-offset-2 transition-opacity hover:opacity-80'
                    style={{ color: HP_CSS_VARS.primary }}
                >
                    {part}
                </a>
            )
        }

        if (/^(https?:\/\/|www\.)/i.test(part)) {
            const href = part.startsWith('http') ? part : `https://${part}`
            return (
                <a
                    key={`${part}-${index}`}
                    href={href}
                    target='_blank'
                    rel='noreferrer'
                    className='underline underline-offset-2 transition-opacity hover:opacity-80'
                    style={{ color: HP_CSS_VARS.primary }}
                >
                    {part}
                </a>
            )
        }

        return <span key={`${part}-${index}`}>{part}</span>
    })
}

function BodyText({ children }: { children: string }) {
    return (
        <p
            className='text-base leading-7 sm:leading-8'
            style={{ color: STATIC_UI_COLORS.textBody, fontFamily: 'var(--hp-font-body)' }}
        >
            {linkifyText(children)}
        </p>
    )
}

function BulletList({ items }: { items: string[] }) {
    return (
        <ul className='mt-3 space-y-2 pl-5 sm:pl-6'>
            {items.map((item) => (
                <li
                    key={item}
                    className='list-disc text-base leading-7 sm:leading-8'
                    style={{ color: STATIC_UI_COLORS.textBody, fontFamily: 'var(--hp-font-body)' }}
                >
                    {linkifyText(item)}
                </li>
            ))}
        </ul>
    )
}

function SectionDivider() {
    return (
        <hr
            className='my-8 border-0 border-t sm:my-10'
            style={{ borderColor: STATIC_UI_COLORS.borderLight }}
        />
    )
}

function renderSectionBody(section: LegalSection) {
    switch (section.type) {
        case 'paragraph':
            return (
                <div className='mt-4 space-y-4'>
                    {section.content ? <BodyText>{section.content}</BodyText> : null}
                    {section.cookie_types?.length ? (
                        <ul className='mt-2 space-y-2 pl-5 sm:pl-6'>
                            {section.cookie_types.map((cookie) => (
                                <li
                                    key={cookie.type}
                                    className='list-disc text-base leading-7 sm:leading-8'
                                    style={{
                                        color: STATIC_UI_COLORS.textBody,
                                        fontFamily: 'var(--hp-font-body)',
                                    }}
                                >
                                    <span className='font-medium capitalize'>{cookie.type}</span>
                                    {': '}
                                    {cookie.description}
                                    {cookie.can_opt_out === false ? ' (required)' : null}
                                </li>
                            ))}
                        </ul>
                    ) : null}
                </div>
            )

        case 'paragraph_group':
            return (
                <div className='mt-4 space-y-4'>
                    {(section.paragraphs ?? []).map((paragraph) => (
                        <BodyText key={paragraph}>{paragraph}</BodyText>
                    ))}
                </div>
            )

        case 'list':
            return (
                <div className='mt-4'>
                    {section.intro ? <BodyText>{section.intro}</BodyText> : null}
                    {section.items?.length ? <BulletList items={section.items} /> : null}
                </div>
            )

        case 'list_with_contact':
            return (
                <div className='mt-4 space-y-3'>
                    {section.intro ? <BodyText>{section.intro}</BodyText> : null}
                    {section.items?.length ? <BulletList items={section.items} /> : null}
                    {section.contact_note ? <BodyText>{section.contact_note}</BodyText> : null}
                </div>
            )

        case 'categorized_list':
            return (
                <div className='mt-4 space-y-6'>
                    {(section.categories ?? []).map((category) => (
                        <div key={category.label}>
                            <p
                                className='text-base font-semibold'
                                style={{
                                    color: STATIC_UI_COLORS.title,
                                    fontFamily: 'var(--hp-font-body)',
                                }}
                            >
                                {category.label}
                            </p>
                            <BulletList items={category.items} />
                        </div>
                    ))}
                </div>
            )

        case 'mixed':
            return (
                <div className='mt-4 space-y-6'>
                    {section.intro ? <BodyText>{section.intro}</BodyText> : null}
                    {(section.subsections ?? []).map((subsection) => (
                        <div key={subsection.id}>
                            <p
                                className='text-base font-semibold'
                                style={{
                                    color: STATIC_UI_COLORS.title,
                                    fontFamily: 'var(--hp-font-body)',
                                }}
                            >
                                {subsection.title}
                            </p>
                            <BulletList items={subsection.items} />
                        </div>
                    ))}
                </div>
            )

        default:
            return (
                <div className='mt-4 space-y-4'>
                    {section.content ? <BodyText>{section.content}</BodyText> : null}
                    {section.intro ? <BodyText>{section.intro}</BodyText> : null}
                    {(section.paragraphs ?? []).map((paragraph) => (
                        <BodyText key={paragraph}>{paragraph}</BodyText>
                    ))}
                    {section.items?.length ? <BulletList items={section.items} /> : null}
                </div>
            )
    }
}

function LegalSkeleton() {
    return (
        <div className='animate-pulse space-y-6' aria-hidden>
            <div className='h-10 w-2/3 rounded bg-neutral-200' />
            <div className='space-y-3 pt-2'>
                <div className='h-4 w-full rounded bg-neutral-200' />
                <div className='h-4 w-[92%] rounded bg-neutral-200' />
                <div className='h-4 w-[85%] rounded bg-neutral-200' />
            </div>
            <div className='h-4 w-40 rounded bg-neutral-200' />
            <div className='h-px w-full bg-neutral-200' />
            <div className='h-7 w-1/3 rounded bg-neutral-200' />
            <div className='space-y-3'>
                <div className='h-4 w-full rounded bg-neutral-200' />
                <div className='h-4 w-[90%] rounded bg-neutral-200' />
            </div>
        </div>
    )
}

function LegalDocumentArticle({ document }: { document: LegalDocument }) {
    const lastUpdated = formatLegalDate(document.page.last_updated)

    return (
        <article>
            <header>
                <h1
                    className='text-3xl font-bold tracking-tight sm:text-4xl lg:text-[42px] lg:leading-tight'
                    style={{ color: STATIC_UI_COLORS.title, fontFamily: 'var(--hp-font-heading)' }}
                >
                    {document.page.title}
                </h1>

                <div className='mt-6 space-y-4 sm:mt-8'>
                    {document.page.intro ? <BodyText>{document.page.intro}</BodyText> : null}
                    {document.page.agreement_note ? (
                        <BodyText>{document.page.agreement_note}</BodyText>
                    ) : null}
                </div>

                {lastUpdated ? (
                    <p
                        className='mt-5 text-sm sm:mt-6 sm:text-base'
                        style={{
                            color: STATIC_UI_COLORS.textMuted,
                            fontFamily: 'var(--hp-font-body)',
                        }}
                    >
                        Last updated: {lastUpdated}
                    </p>
                ) : null}
            </header>

            {document.sections.map((section) => (
                <section key={section.id}>
                    <SectionDivider />
                    <h2
                        className='text-xl font-semibold tracking-tight sm:text-2xl'
                        style={{
                            color: STATIC_UI_COLORS.title,
                            fontFamily: 'var(--hp-font-heading)',
                        }}
                    >
                        {section.title}
                    </h2>
                    {renderSectionBody(section)}
                </section>
            ))}

            {document.contact ? (
                <>
                    <SectionDivider />
                    <h2
                        className='text-xl font-semibold tracking-tight sm:text-2xl'
                        style={{
                            color: STATIC_UI_COLORS.title,
                            fontFamily: 'var(--hp-font-heading)',
                        }}
                    >
                        {document.contact.section_title || 'Questions?'}
                    </h2>
                    <div className='mt-4 space-y-2'>
                        {document.contact.company_name ? (
                            <BodyText>{document.contact.company_name}</BodyText>
                        ) : null}
                        {(document.contact.support_email || document.contact.email) && (
                            <BodyText>
                                {`Email: ${document.contact.support_email || document.contact.email}`}
                            </BodyText>
                        )}
                        {document.contact.whatsapp ? (
                            <BodyText>{`WhatsApp: ${document.contact.whatsapp}`}</BodyText>
                        ) : null}
                        {document.contact.address ? (
                            <BodyText>{document.contact.address}</BodyText>
                        ) : null}
                    </div>
                </>
            ) : null}

            {document.page.footer_note ? (
                <>
                    <SectionDivider />
                    <BodyText>{document.page.footer_note}</BodyText>
                </>
            ) : null}
        </article>
    )
}

type LegalDocumentViewProps = {
    document: LegalDocument | null
    isLoading?: boolean
    emptyTitle: string
    emptyDescription: string
}

export function LegalDocumentView({
    document,
    isLoading = false,
    emptyTitle,
    emptyDescription,
}: LegalDocumentViewProps) {
    if (isLoading) {
        return <LegalSkeleton />
    }

    if (!document) {
        return (
            <SectionEmptyState
                icon={FileText}
                title={emptyTitle}
                description={emptyDescription}
            />
        )
    }

    return <LegalDocumentArticle document={document} />
}

export function LegalPageShell({ children }: { children: ReactNode }) {
    return (
        <main className='min-h-screen bg-white'>
            <div className='agency-container pb-16 pt-28 sm:pb-20 sm:pt-36 lg:pb-24 lg:pt-40'>
                <div className='mx-auto max-w-[760px]'>{children}</div>
            </div>
        </main>
    )
}
