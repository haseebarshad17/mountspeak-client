'use client'

import ExploreTheWorld from '@/components/pages/marketing/home/ExploreTheWorld'
import TourismTravelingGallery from '@/components/pages/marketing/home/TourismTravelingGallery'
import Hero from '@/components/pages/marketing/home/Hero'
import OurServices from '@/components/pages/marketing/home/OurServices'
import PlanPerfectTrip from '@/components/pages/marketing/home/PlanPerfectTrip'
import PopularDestinationSection from '@/components/pages/marketing/home/PopularDestinationSection'
import Testimonials from '@/components/pages/marketing/home/Testimonials'
import BookATour from '@/components/pages/marketing/home/BookATour'
import MeetOurTeam from '@/components/pages/marketing/home/MeetOurTeam'
import PopularTravelBlogs from '@/components/pages/marketing/home/PopularTravelBlogs'
import { useHomepagePageWithFallback } from '@/hooks/useHomepagePageWithFallback'
import { selectHomepageIsLoading } from '@/store/homepage/homepage.selectors'
import { useAppSelector } from '@/store/hooks'

type HomePageContentProps = {
    tourLocations?: string[]
}

export default function HomePageContent({ tourLocations = [] }: HomePageContentProps) {
    const page = useHomepagePageWithFallback()
    const isLoading = useAppSelector(selectHomepageIsLoading)

    if (isLoading || !page) {
        return (
            <div className='homepage flex min-h-[50vh] items-center justify-center'>
                <p className='text-sm text-neutral-500'>Loading homepage…</p>
            </div>
        )
    }

    return (
        <div className='homepage'>
            <Hero page={page} tourLocations={tourLocations} />
            <PlanPerfectTrip page={page} />
            <OurServices page={page} />
            <PopularDestinationSection page={page} />
            <ExploreTheWorld page={page} />
            <TourismTravelingGallery page={page} />
            <BookATour page={page} />
            <MeetOurTeam page={page} />
            <PopularTravelBlogs page={page} />
            <Testimonials page={page} />
        </div>
    )
}
