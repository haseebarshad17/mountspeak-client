import HeroFilters from '@/components/pages/public/home/HeroFilters'
import React from 'react'

const Hero = () => {
    return (
        <section className='p-2 pb-14 sm:p-3 sm:pb-16 md:p-4 lg:p-5 lg:pb-20 xl:p-[30px] xl:pb-[112px]'>
            <div className='
            rounded-[16px] bg-[url("/images/pages/home/tour-list.png")] 
            bg-cover bg-center bg-no-repeat'
            >
                <main className='pb-8 pt-[150px] sm:pb-10 sm:pt-40 md:pb-12 md:pt-48 lg:pb-16 lg:pt-56 xl:pb-[100px] xl:pt-[257px]'>
                    <div className='agency-container'>
                        <div className='w-full max-w-[828px] mx-auto text-center text-white'>
                            <h1 className='text-3xl font-semibold leading-[0.95] sm:text-4xl md:text-5xl xl:text-[45px]'>Don’t call it a dream. Call it a plan</h1>
                            <p className='pt-3 text-sm font-normal sm:pt-4 sm:text-base xl:text-lg'>
                                Travel the way you wish to go with Phnes Travels helping you discover,
                                live and travel at your own pace.
                            </p>
                        </div>

                        <div className='mx-auto w-full max-w-[867px] pt-10 sm:pt-14 md:pt-20 lg:pt-24 xl:pt-[180px]'>
                            <HeroFilters />
                        </div>
                    </div>
                </main>
            </div>
        </section>
    )
}

export default Hero