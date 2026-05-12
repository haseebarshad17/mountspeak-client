import TourPageContent from '@/components/pages/tour/TourPageContent'
import React from 'react'

type TourPageProps = {
    params: {
        tour: string[]
    }
}


const page = ({ params }: TourPageProps) => {
    const tourSlug = Array.isArray(params.tour) ? params.tour[0] : params.tour;

    return <TourPageContent tourSlug={tourSlug} />
}

export default page