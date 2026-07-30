import { MarketingPageShell } from '@/components/pages/MarketingPageShell'
import { loadAgencyContext } from '@/lib/site/load-agency-context'

export default async function AboutUsPage() {
    const { homepage, capabilities } = await loadAgencyContext()

    return (
        <MarketingPageShell
            page={homepage.page}
            capabilities={capabilities}
            agencyId={homepage.agencyId}
            title="About Us"
            subtitle="We build thoughtful travel experiences with clear, specialization-based service delivery."
        >
            <section className="pb-20">
                <div className="site-container grid gap-6 md:grid-cols-3">
                    <article className="rounded-2xl bg-white p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-[#111]">Mission</h3>
                        <p className="mt-2 text-sm text-[#666]">
                            Deliver reliable travel solutions aligned with each agency plan.
                        </p>
                    </article>
                    <article className="rounded-2xl bg-white p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-[#111]">Approach</h3>
                        <p className="mt-2 text-sm text-[#666]">
                            Keep architecture and user experience clean, fast, and consistent.
                        </p>
                    </article>
                    <article className="rounded-2xl bg-white p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-[#111]">Promise</h3>
                        <p className="mt-2 text-sm text-[#666]">
                            Transparent offerings by specialization: tours, packages, and international.
                        </p>
                    </article>
                </div>
            </section>
        </MarketingPageShell>
    )
}
