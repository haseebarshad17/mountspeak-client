import React from 'react'

import { Button } from '@/components/ui/button'
import { promoBannerContent } from './content'

const PromoBanner = () => {
    return (
        <section className='bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-12 text-white'>
            <div className='container flex flex-col items-start justify-between gap-6 md:flex-row md:items-center'>
                <div>
                    <h2 className='text-3xl'>{promoBannerContent.title}</h2>
                    <p className='mt-2 text-lg text-purple-100'>{promoBannerContent.subtitle}</p>
                </div>
                <Button variant='secondary' className='bg-white text-purple-600 hover:bg-neutral-100'>
                    {promoBannerContent.buttonLabel}
                </Button>
            </div>
        </section>
    )
}

export default PromoBanner
