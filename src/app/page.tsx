import ExploreTheWorld from '@/components/pages/marketing/home/ExploreTheWorld'
import TourismTravelingGallery from '@/components/pages/marketing/home/TourismTravelingGallery'
import FlightHotels from '@/components/pages/marketing/home/FlightHotels'
import Hero from '@/components/pages/marketing/home/Hero'
import OurServices from '@/components/pages/marketing/home/OurServices'
import PlanPerfectTrip from '@/components/pages/marketing/home/PlanPerfectTrip'
import PopularDestination from '@/components/pages/marketing/home/PopularDestination'
import Testimonials from '@/components/pages/marketing/home/Testimonials'
import TopDestinations from '@/components/pages/marketing/home/TopDestinations'
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
            <PopularDestination />
            <TopDestinations />
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