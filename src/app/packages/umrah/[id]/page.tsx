import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { PackageDetailContent } from '@/components/packages/PackageDetailContent'
import { loadAgencyContext } from '@/lib/site/load-agency-context'
import { createServerSupabase } from '@/lib/supabase/supabase.server'
import { getUmrahPlanById } from '@/services/listings/listings.service'
import { isValidAgencyId } from '@/services/specialization/specialization.service'

type PageProps = {
    params: { id: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { homepage } = await loadAgencyContext()
    if (!isValidAgencyId(homepage.agencyId)) {
        return { title: 'Umrah package' }
    }

    const pkg = await getUmrahPlanById({
        supabase: createServerSupabase(),
        agencyId: homepage.agencyId,
        id: params.id,
    })

    if (!pkg) return { title: 'Package not found' }

    return {
        title: pkg.title,
        description: pkg.shortDescription || pkg.detailedDescription || pkg.title,
        openGraph: pkg.heroImageUrl
            ? {
                  title: pkg.title,
                  description: pkg.shortDescription || undefined,
                  images: [{ url: pkg.heroImageUrl, alt: pkg.title }],
              }
            : undefined,
    }
}

export default async function UmrahPackageDetailPage({ params }: PageProps) {
    const { homepage, capabilities } = await loadAgencyContext()
    if (!isValidAgencyId(homepage.agencyId)) notFound()

    const pkg = await getUmrahPlanById({
        supabase: createServerSupabase(),
        agencyId: homepage.agencyId,
        id: params.id,
    })

    if (!pkg) notFound()

    return (
        <PackageDetailContent
            page={homepage.page}
            capabilities={capabilities}
            packageDetail={pkg}
        />
    )
}
