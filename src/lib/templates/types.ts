/**
 * Styling CMS shape for agency-site templates.
 * Values are Tailwind class strings merged via `cn()` with section base classes.
 * Prefer layout/alignment/radius/size deltas — not full redesigns.
 */

export type TemplateKey = 'mount-temp-1' | 'mount-temp-2'

export type TemplateStyles = {
    header: {
        /** Floating header shell radius / shape */
        shell: string
    }
    hero: {
        /** Title + paragraph wrapper (alignment, max-width) */
        content: string
        heading: string
        paragraph: string
        filtersWrap: string
    }
    heroFilters: {
        /** Search form outer radius */
        form: string
        /** Filter field / dropdown radius (mobile; desktop strip often resets) */
        field: string
        /** Search submit button radius */
        searchButton: string
    }
}
