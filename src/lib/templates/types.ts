/**
 * Styling CMS shape for agency-site templates.
 * Values are Tailwind class strings merged via `cn()` with section base classes.
 * Prefer layout/alignment/radius/size deltas — not full redesigns.
 */

export type TemplateKey = 'mount-temp-1' | 'mount-temp-2'

export type HomePageTemplateStyles = {
    hero: {
        content: string
        heading: string
        paragraph: string
        filtersWrap: string
        tabsWrap: string
    }
    heroFilters: {
        form: string
        field: string
        searchButton: string
    }
    /** Shared homepage section title blocks (keep centered across templates). */
    sectionHeader: {
        wrap: string
        title: string
    }
    tourCard: {
        shell: string
        imageWrap: string
        content: string
        cta: string
        discountBadge: string
        discountPill: string
        categoryBadge: string
        saveShare: string
    }
    destinationCard: {
        shell: string
        image: string
        content: string
    }
    trust: Record<string, never>
    planPerfectTrip: Record<string, never>
    services: Record<string, never>
    popularDestination: Record<string, never>
    explore: Record<string, never>
    gallery: Record<string, never>
    bookATour: Record<string, never>
    team: Record<string, never>
    blogs: Record<string, never>
    testimonials: Record<string, never>
}

export type TemplateStyles = {
    generic: {
        header: {
            /** Floating header shell radius / shape */
            shell: string
        }
        footer: {
            outer: string
            shell: string
            pattern: string
            content: string
            mainGrid: string
            brandBlock: string
            columnsGrid: string
            newsletterSection: string
            newsletterInner: string
            newsletterCopy: string
            newsletterTitle: string
            newsletterDesc: string
            newsletterForm: string
            newsletterInput: string
            newsletterButton: string
            bottomBar: string
            copyright: string
            accentBar: string
            ghostBrand: string
        }
    }
    pages: {
        home: HomePageTemplateStyles
        /** Reserved for future page-level style modules. */
        about: Record<string, never>
    }
}
