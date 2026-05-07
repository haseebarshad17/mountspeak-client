import Image from 'next/image'
import React from 'react'

const PlanPerfectTrip = () => {

    const features = [
        { title: "150+", desciption: "Flight Destinations" },
        { title: "250+", desciption: "Hotels" },
        { title: "80", desciption: "Elite Transportation" },
        { title: "40+", desciption: "We help to find your dream place" },
    ]

    return (
        <section className='pb-16 sm:pb-20 lg:pb-[112px]'>
            <div className='agency-container'>
                <div className='grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-8 lg:gap-12 xl:gap-[100px]'>
                    <div>
                        <Image
                            src='/images/pages/home/plan-perfect-trip.png'
                            alt='Plan Perfect Trip'
                            width={580}
                            height={448}
                            className='h-max w-full max-w-[580px]'
                        />
                    </div>

                    <div className='pt-0 md:pt-2 lg:pt-0 xl:pt-[38px]'>
                        <span className='text-sm font-semibold uppercase tracking-[0.12em] text-primary-500 sm:text-base'>about</span>
                        <h4 className='agency-section-heading pt-1'>Plan your perfect trip</h4>
                        <p className="pt-4 text-sm font-normal leading-7 sm:pt-5 sm:text-base" >
                            Are you looking for an adventurous travel, or just carrying your work alongside you while you travel
                            and explore new places, then your perfect trip is one with us, Phnes travels help you search flights & places,
                            book your most convenient hotels/places at your comfort while we help you discover the world.
                            Welcome to a new dispensation.
                        </p>

                        <div className="grid w-full grid-cols-2 gap-x-4 gap-y-5 pt-6 sm:pt-8">
                            {features.map((item, idx) => (
                                <div key={idx}>
                                    <h6 className='text-2xl font-semibold text-primary-500 sm:text-[28px]'>{item.title}</h6>
                                    <p className='pt-1 text-sm font-normal sm:text-base'>{item.desciption}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default PlanPerfectTrip