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
import { getHomepageThemeCssVars } from '@/data/homepage'
import { homepage } from '@/data/homepage'
import { getHomepageMetadata } from '@/lib/homepage/homepage-meta'
import { fetchTourLocationOptions } from '@/services/tours/tours.server'
import type { Viewport } from 'next'

export const metadata = getHomepageMetadata()

export const viewport: Viewport = {
    themeColor: homepage.seo.themeColor,
}

export default async function Page() {
    const tourLocations = await fetchTourLocationOptions()

    return (
        <div className='homepage' style={getHomepageThemeCssVars()}>
            <Hero tourLocations={tourLocations} />
            <PlanPerfectTrip />
            <OurServices />
            <PopularDestinationSection />
            <ExploreTheWorld />
            <TourismTravelingGallery />
            <BookATour />
            <MeetOurTeam />
            <PopularTravelBlogs />
            <Testimonials />
        </div>
    )
}
