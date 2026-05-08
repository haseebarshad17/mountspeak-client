import FlightHotels from '@/components/pages/marketing/home/FlightHotels'
import Hero from '@/components/pages/marketing/home/Hero'
import PlanPerfectTrip from '@/components/pages/marketing/home/PlanPerfectTrip'
import Testimonials from '@/components/pages/marketing/home/Testimonials'
import TopDestinations from '@/components/pages/marketing/home/TopDestinations'
import React from 'react'


const Page = () => {
    return (
        <div>
            <Hero />
            <PlanPerfectTrip />
            <TopDestinations />
            <FlightHotels />
            <Testimonials />
        </div>
    )
}

export default Page