import ExploreTheWorld from '@/components/pages/marketing/home/ExploreTheWorld'
import TourismTravelingGallery from '@/components/pages/marketing/home/TourismTravelingGallery'
import Hero from '@/components/pages/marketing/home/Hero'
import OurServices from '@/components/pages/marketing/home/OurServices'
import PlanPerfectTrip from '@/components/pages/marketing/home/PlanPerfectTrip'
import PopularDestinationSection from '@/components/pages/marketing/home/PopularDestinationSection'
import Testimonials from '@/components/pages/marketing/home/Testimonials'
import React from 'react'
import BookATour from '@/components/pages/marketing/home/BookATour'
import MeetOurTeam from '@/components/pages/marketing/home/MeetOurTeam'
import PopularTravelBlogs from '@/components/pages/marketing/home/PopularTravelBlogs'


const Page = () => {
    return (
        <div>
            <Hero />
            <PlanPerfectTrip />
            <OurServices />
            <PopularDestinationSection />
            <ExploreTheWorld />
            <TourismTravelingGallery />
            {/* <FlightHotels /> */}
            <BookATour />
            <MeetOurTeam />
            <PopularTravelBlogs />
            <Testimonials />
        </div>
    )
}

export default Page