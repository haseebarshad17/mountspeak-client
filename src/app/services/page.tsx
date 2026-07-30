import { MarketingPageShell } from '@/components/pages/MarketingPageShell'
import { loadAgencyContext } from '@/lib/site/load-agency-context'
import {
    Compass,
    Plane,
    Building2,
    MapPinned,
    Car,
    Camera,
} from 'lucide-react'

const SERVICE_ITEMS = [
    { title: 'Travel Planning', icon: Compass },
    { title: 'Flight Support', icon: Plane },
    { title: 'Hotel Booking', icon: Building2 },
    { title: 'Route Consultation', icon: MapPinned },
    { title: 'Transport Management', icon: Car },
    { title: 'Trip Media Coverage', icon: Camera },
]

export default async function ServicesPage() {
    const { homepage, capabilities } = await loadAgencyContext()

    return (
        <MarketingPageShell
            page={homepage.page}
            capabilities={capabilities}
            agencyId={homepage.agencyId}
            title="Services"
            subtitle="Minimal, premium travel services designed around agency specializations."
        >
            <section className="pb-20">
                <div className="site-container grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {SERVICE_ITEMS.map((item) => {
                        const Icon = item.icon
                        return (
                            <article key={item.title} className="rounded-2xl bg-white p-6 shadow-sm">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#06403D]/10 text-[#06403D]">
                                    <Icon className="h-5 w-5" />
                                </div>
                                <h3 className="mt-4 text-lg font-semibold text-[#111]">{item.title}</h3>
                            </article>
                        )
                    })}
                </div>
            </section>
        </MarketingPageShell>
    )
}
