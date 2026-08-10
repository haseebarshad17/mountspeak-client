/** Homepage content shape — mirrors `src/content/homepage-defaults.json`. */

export type MediaAsset = {
    src: string
    alt: string
    width?: number
    height?: string | number
}

export type NavItem = {
    label: string
    href: string | null
}

export type HomepageSeo = {
    siteName: string
    title: string
    titleTemplate: string
    description: string
    keywords: string[]
    canonicalUrl: string
    ogImage: string
    ogImageAlt: string
    locale: string
    robots: { index: boolean; follow: boolean }
    themeColor: string
    twitterCard: string
}

export type HomepageTheme = {
    buttons: {
        primary: {
            background: string
            backgroundHover: string
            text: string
            border?: string
        }
    }
}

export type HomepageBranding = {
    name: string
    tagline: string
    logo: {
        default: MediaAsset
        onDark: MediaAsset
    }
}

export type HomepageFooter = {
    backgroundColor: string
    logo: MediaAsset
    columns: Array<{
        title: string
        items?: NavItem[]
        links?: NavItem[]
    }>
    socialLinks?: {
        twitter?: string | null
        facebook?: string | null
        linkedin?: string | null
        instagram?: string | null
    }
}

export type LegalDocument = {
    title: string
    subtitle?: string
    lastUpdated?: string
    sections: Array<{
        heading: string
        body: string
    }>
}

export type AgencySitePages = {
    privacyPolicy?: LegalDocument
    termsOfService?: LegalDocument
}

export type HomepageHeader = {
    navigation: NavItem[]
    auth: {
        login: NavItem
        signUp: NavItem
        logout: { label: string }
    }
    mobileMenu: {
        openLabel: string
        closeLabel: string
        overlayCloseLabel: string
    }
}

export type HeroSection = {
    id: string
    backgroundImage?: string
    backgroundImages?: string[]
    title: string
    paragraph: string
    searchFilters: {
        fromPlaceholder: string
        toPlaceholder: string
        datePlaceholder: string
        startDateLabel?: string
        endDateLabel?: string
        searchButtonLabel: string
        loadingCities: string
        noCities: string
        pickDepartureFirst: string
        clearDate: string
        doneDate: string
    }
}

export type PlanPerfectTripSection = {
    id: string
    eyebrow: string
    title: string
    paragraph: string
    image: MediaAsset
    stats: Array<{ value: string; label: string }>
}

export type OurServicesSection = {
    id: string
    eyebrow: string
    title: string
    backgroundColor: string
    cta: NavItem
    items: Array<{
        title: string
        description: string
        iconSrc: string
        iconAlt: string
        iconPosition: 'start' | 'end'
    }>
}

export type PopularDestinationSection = {
    id: string
    eyebrow: string
    title: string
    filters: string[]
    topDestinations: {
        subtitle: string
        title: string
        seeAllLabel: string
        seeAllHref: string
        avatars: string[]
        moreTravelersLabel: string
        emptyMessage: string
    }
    cards: Array<{
        id: string
        name: string
        region: string
        image: string
    }>
}

export type ExploreTheWorldSection = {
    id: string
    eyebrow: string
    title: string
    paragraph: string
    emptyMessage: string
}

export type TourismGallerySection = {
    id: string
    eyebrow: string
    title: string
    paragraph: string
    filters: string[]
    images: Array<{ src: string; alt: string; category: string }>
}

export type BookATourSection = {
    id: string
    backgroundImage: string
    eyebrow: string
    title: string
    paragraphs: string[]
    promoHighlight: string
    cta: NavItem
    form: {
        title: string
        subtitle: string
        submitLabel: string
        submittingLabel: string
        successToast: string
        errorToast: string
        validationToast: string
        placeholders: {
            fullName: string
            email: string
            phone: string
            travelDate: string
            destination: string
            destinationLoading: string
            category: string
            message: string
        }
    }
}

export type MeetOurTeamSection = {
    id: string
    eyebrow: string
    title: string
    members?: Array<{ name: string; role: string; image?: string }>
}

export type PopularTravelBlogsSection = {
    id: string
    eyebrow: string
    title: string
    paragraph: string
    postedByPrefix: string
    readMoreLabel: string
    posts: Array<{
        title: string
        author: string
        date: string
        excerpt: string
        image: string
        href: string
    }>
}

export type TestimonialsSection = {
    id: string
    eyebrow: string
    title: string
    items?: Array<{
        name: string
        location: string
        quote: string
        avatar: string
    }>
}

export type TrustSection = {
    id: string
    eyebrow: string
    title: string
    logos?: Array<{ src: string; alt: string }>
}

export type HomepageSections = {
    hero: HeroSection
    trust: TrustSection
    planPerfectTrip: PlanPerfectTripSection
    ourServices: OurServicesSection
    popularDestination: PopularDestinationSection
    exploreTheWorld: ExploreTheWorldSection
    tourismGallery: TourismGallerySection
    bookATour: BookATourSection
    meetOurTeam: MeetOurTeamSection
    popularTravelBlogs: PopularTravelBlogsSection
    testimonials: TestimonialsSection
}

export type HomepagePage = {
    id: string
    slug: string
    type: string
    status: string
    locale: string
    templateId: string
    seo: HomepageSeo
    theme: HomepageTheme
    branding: HomepageBranding
    header?: HomepageHeader
    footer: HomepageFooter
    sections: HomepageSections
    /** Optional CMS pages: privacy, terms, FAQ — from admin theme JSON. */
    pages?: AgencySitePages
}

export type HomepageDocument = {
    page: HomepagePage
}

export type AgencySiteThemeRow = {
    id?: string
    agency_id: string
    site_url: string | null
    theme: unknown
    specialization_id?: string | null
    branding_logos?: string[] | null
    created_at?: string
    updated_at?: string
}

export type AgencyHomepage = {
    agencyId: string
    siteUrl: string | null
    isAgencySite: boolean
    specializationId?: string | null
    page: HomepagePage
}
