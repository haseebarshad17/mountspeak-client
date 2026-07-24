/**
 * Styling CMS shape for agency-site templates.
 * Values are Tailwind class strings merged via `cn()` with section base classes.
 */

export type TemplateKey = 'mount-temp-1' | 'mount-temp-2' | 'mount-temp-3'

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
        /**
         * marquee — infinite scroll (default / temp-1 / temp-2)
         * fade — WAWCD-style 6-up grid that fades between logo pages (temp-3)
         */
        variant?: 'marquee' | 'fade'
        /** Optional logo card shell (temp-3). When omitted, classic bare logo sizing is used. */
        card?: string
        /** Optional logo image classes (temp-3). When omitted, classic grayscale hover is used. */
        logo?: string
        /** Optional marquee wrapper classes. */
        marquee?: string
    }
    planPerfectTrip: {
        /**
         * classic — image + copy + plain stats (temp-1 / temp-2)
         * showcase — premium About layout with framed media, pills, cards (temp-3)
         */
        variant: 'classic' | 'showcase'
        /** Outer section shell (background, padding). Empty string for classic. */
        section: string
        /** Inner max-width container overrides. Empty string uses default agency-container. */
        container: string
        grid: string
        media: string
        /** Image element classes (showcase frame / hover). Empty for classic. */
        image: string
        copy: string
        eyebrow: string
        title: string
        paragraph: string
        stats: string
        /** Individual statistic card (showcase). Empty for classic. */
        statCard: string
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
        /**
         * classic — floating avatar + stars (temp-1 / temp-2)
         * premium — panel card with top avatar, quote mark, side arrows (temp-3)
         */
        variant?: 'classic' | 'premium'
        /** Optional outer section padding / background (temp-3). */
        section?: string
        header: string
        quote: string
        meta: string
        /** Optional carousel shell for premium arrows / gutters. */
        carouselWrap?: string
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
