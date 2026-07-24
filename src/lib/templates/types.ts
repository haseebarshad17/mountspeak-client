/**
 * Styling CMS shape for agency-site templates.
 * Values are Tailwind class strings merged via `cn()` with section base classes.
 */

export type TemplateKey = 'mount-temp-1' | 'mount-temp-2'

export type HomePageTemplateStyles = {
    hero: {
        /** Outer padding around the banner */
        section: string
        /** Banner media shell (radius, overflow) */
        banner: string
        /** Dark overlay over the hero image */
        overlay: string
        /** Inner content vertical rhythm / padding */
        main: string
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
    /** Shared homepage section title blocks. */
    sectionHeader: {
        wrap: string
        title: string
        /** Passed into SectionEyebrow `className` (alignment / label scale). */
        eyebrow: string
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
    trust: {
        section: string
        header: string
        title: string
        row: string
    }
    planPerfectTrip: {
        grid: string
        media: string
        copy: string
        stats: string
    }
    services: {
        section: string
        header: string
        grid: string
        card: string
    }
    popularDestination: {
        header: string
        listHeader: string
        carouselWrap: string
    }
    explore: {
        header: string
        grid: string
    }
    gallery: {
        header: string
        grid: string
        tile: string
    }
    bookATour: {
        overlay: string
        grid: string
        copy: string
        formPanel: string
    }
    team: {
        header: string
        grid: string
        card: string
        cardBody: string
    }
    blogs: {
        header: string
        grid: string
        card: string
        cardContent: string
    }
    testimonials: {
        header: string
        quote: string
        meta: string
    }
}

export type GenericTemplateStyles = {
    header: {
        /** Floating header shell radius / shape */
        shell: string
    }
    footer: {
        outer: string
        shellWrap: string
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

export type TemplateStyles = {
    generic: GenericTemplateStyles
    pages: {
        home: HomePageTemplateStyles
        about: Record<string, never>
    }
}
