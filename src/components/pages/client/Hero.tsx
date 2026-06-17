import { Search } from 'lucide-react'
import React from 'react'

import { Button } from '@/components/ui/button'
import { heroContent } from './content'

const Hero = () => {
    return (
        <section className='bg-gradient-to-br from-[rgb(var(--color-primary-500))] to-[rgb(var(--color-primary-700))] px-4 py-20 text-white'>
            <div className='container'>
                <div className='mx-auto mb-10 max-w-3xl text-center'>
                    <h1 className='text-4xl md:text-5xl'>{heroContent.title}</h1>
                    <p className='mt-4 text-base text-blue-100 md:text-xl'>{heroContent.subtitle}</p>
                </div>

                <div className='mx-auto w-full max-w-3xl rounded-lg bg-white p-2 shadow-xl'>
                    <div className='flex flex-col gap-2 sm:flex-row'>
                        <div className='flex flex-1 items-center gap-3 px-4'>
                            <Search className='h-5 w-5 text-neutral-400' />
                            <input
                                type='text'
                                placeholder={heroContent.searchPlaceholder}
                                className='w-full py-3 text-neutral-900 placeholder:text-neutral-400 focus:outline-none'
                            />
                        </div>
                        <Button className='shrink-0'>
                            {heroContent.searchButtonLabel}
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Hero
