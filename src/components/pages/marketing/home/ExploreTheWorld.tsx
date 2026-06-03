import { SectionEyebrow } from '@/components/ui/section-eyebrow'
import { TourExploreCard } from '@/components/tours/TourExploreCard'
import { homepage } from '@/data/homepage'
import { fetchPublishedTours } from '@/services/tours/tours.server'

const section = homepage.sections.exploreTheWorld
const { colors } = homepage.theme

const ExploreTheWorld = async () => {
    const tours = await fetchPublishedTours()

    return (
        <section
            className='overflow-hidden bg-white pb-12 sm:pb-16 md:pb-20 lg:pb-[112px]'
            aria-labelledby='explore-the-world-heading'
        >
            <div className='agency-container'>
                <header className='mx-auto max-w-[900px] px-1 text-center sm:px-0'>
                    <SectionEyebrow name={section.eyebrow} />
                    <h2
                        id='explore-the-world-heading'
                        className='agency-section-heading pt-2 text-[28px] font-medium leading-tight sm:pt-3 sm:text-[34px] sm:leading-[40px] lg:pt-4 lg:text-[40px] lg:leading-[48px]'
                        style={{ color: colors.title, fontFamily: 'var(--hp-font-heading)' }}
                    >
                        {section.title}
                    </h2>
                    <p
                        className='mx-auto max-w-[861px] pt-3 text-sm font-normal leading-6 sm:pt-4 sm:text-base sm:leading-7 md:pt-5 md:text-lg md:leading-8'
                        style={{ color: colors.textMuted, fontFamily: 'var(--hp-font-body)' }}
                    >
                        {section.paragraph}
                    </p>
                </header>

                {tours.length > 0 ? (
                    <div className='grid grid-cols-1 justify-items-center gap-4 pt-8 xs:gap-5 sm:grid-cols-2 sm:gap-6 sm:pt-10 md:pt-12 lg:grid-cols-3 lg:justify-items-stretch lg:gap-6 lg:pt-14'>
                        {tours.map((tour) => (
                            <TourExploreCard
                                key={tour.id}
                                slug={tour.slug}
                                discount={tour.discountLabel}
                                title={tour.title}
                                image={tour.image}
                            />
                        ))}
                    </div>
                ) : (
                    <p
                        className='mx-auto max-w-xl pt-10 text-center text-base'
                        style={{ color: colors.textMuted, fontFamily: 'var(--hp-font-body)' }}
                    >
                        {section.emptyMessage}
                    </p>
                )}
            </div>
        </section>
    )
}

export default ExploreTheWorld
