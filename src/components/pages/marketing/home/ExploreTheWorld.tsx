import { SectionEyebrow } from '@/components/ui/section-eyebrow'
import { TourExploreCard } from '@/components/tours/TourExploreCard'
import { fetchPublishedTours } from '@/services/tours/tours.server'

const ExploreTheWorld = async () => {
    const tours = await fetchPublishedTours()

    return (
        <section
            className='overflow-hidden bg-white pb-12 sm:pb-16 md:pb-20 lg:pb-[112px]'
            aria-labelledby='explore-the-world-heading'
        >
            <div className='agency-container'>
                <header className='mx-auto max-w-[900px] px-1 text-center sm:px-0'>
                    <SectionEyebrow name='Explore Tour' />
                    <h2
                        id='explore-the-world-heading'
                        className='agency-section-heading pt-2 text-[28px] font-medium leading-tight text-[#14141F] sm:pt-3 sm:text-[34px] sm:leading-[40px] lg:pt-4 lg:text-[40px] lg:leading-[48px]'
                    >
                        The World
                    </h2>
                    <p className='mx-auto max-w-[861px] pt-3 font-roboto text-sm font-normal leading-6 text-neutral-600 sm:pt-4 sm:text-base sm:leading-7 md:pt-5 md:text-lg md:leading-8'>
                        Discover amazing national and international tour packages tailored to your travel preferences.
                        From weekend getaways to international adventures, we have the perfect tour for every traveler.
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
                    <p className='mx-auto max-w-xl pt-10 text-center font-roboto text-base text-neutral-500'>
                        Tours will appear here once they are published.
                    </p>
                )}
            </div>
        </section>
    )
}

export default ExploreTheWorld
