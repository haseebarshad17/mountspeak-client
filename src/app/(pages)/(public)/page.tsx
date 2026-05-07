import FlightHotels from '@/components/pages/public/home/FlightHotels'
import Hero from '@/components/pages/public/home/Hero'
import PlanPerfectTrip from '@/components/pages/public/home/PlanPerfectTrip'
import Testimonials from '@/components/pages/public/home/Testimonials'
import TopDestinations from '@/components/pages/public/home/TopDestinations'
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