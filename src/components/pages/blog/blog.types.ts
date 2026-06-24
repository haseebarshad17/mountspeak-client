export type BlogContentBlock =
    | { type: 'paragraph'; content: string }
    | { type: 'heading'; content: string }
    | { type: 'quote'; content: string; attribution?: string }
    | { type: 'image'; src: string; alt: string; caption?: string }
    | { type: 'list'; items: string[] }

export type BlogDetailPageContent = {
    page: {
        slug: string
        seo: {
            metaTitle: string
            metaDescription: string
            ogImage?: string
        }
        hero: {
            eyebrow: string
            title: string
            author: string
            date: string
            likes: number
            comments: number
            image: string
        }
        article: {
            intro: string
            sections: BlogContentBlock[]
        }
        tags: string[]
        relatedCta: {
            title: string
            description: string
            buttonLabel: string
            buttonHref: string
        }
    }
}
