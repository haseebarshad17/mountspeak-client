import ClientHeader from '@/components/pages/client/client-header'
import Categories from '../../../components/pages/client/Categories'
import Cta from '../../../components/pages/client/Cta'
import FeaturedTours from '../../../components/pages/client/FeaturedTours'
import Hero from '../../../components/pages/client/Hero'
import PromoBanner from '../../../components/pages/client/PromoBanner'
import TopAgencies from '../../../components/pages/client/TopAgencies'
import React from 'react'
import ClientFooter from '@/components/pages/client/client-footer'

const Page = () => {
    return (
        <main className='min-h-screen bg-neutral-50'>
            <ClientHeader />
            <Hero />
            <Categories />
            <FeaturedTours />
            <PromoBanner />
            <TopAgencies />
            <Cta />
            <ClientFooter />
        </main>
    )
}

export default Page