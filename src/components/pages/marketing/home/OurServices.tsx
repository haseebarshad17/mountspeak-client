import { Button } from '@/components/ui/button'
import { SectionEyebrow } from '@/components/ui/section-eyebrow'
import Image from 'next/image'
import React from 'react'

type ServiceItem = {
    title: string
    description: string
    iconSrc: string
    iconAlt: string
    iconPosition: 'start' | 'end'
}

const services: ServiceItem[] = [
    {
        title: 'Honeymoon Packages',
        description:
            'Romantic destinations and luxurious stays for newlyweds creating peaceful and memorable getaways.',
        iconSrc: '/images/pages/home/heart.png',
        iconAlt: 'Honeymoon packages',
        iconPosition: 'end',
    },
    {
        title: 'Corporate & Group Tours',
        description:
            'Perfectly planned tours for offices, organizations, and large groups ensuring smooth coordination and premium services.',
        iconSrc: '/images/pages/home/Symbol.png',
        iconAlt: 'Corporate and group tours',
        iconPosition: 'start',
    },
    {
        title: 'Adventure & Trekking Tours',
        description:
            'Experience the thrill of mountains, lakes, and more with our adventure specialists and safety-first approach.',
        iconSrc: '/images/pages/home/Symbol (2).png',
        iconAlt: 'Adventure and trekking tours',
        iconPosition: 'end',
    },
    {
        title: 'Transportation Services',
        description:
            'From luxury cars to jeeps, we provide reliable and comfortable vehicles for all terrains and group sizes.',
        iconSrc: '/images/pages/home/Symbol (3).png',
        iconAlt: 'Transportation services',
        iconPosition: 'start',
    },
    {
        title: 'Hotel & Resort Booking',
        description:
            'Stay in luxurious hotels and resorts with the best comfort, views, and hospitality throughout your journey.',
        iconSrc: '/images/pages/home/Symbol (4).png',
        iconAlt: 'Hotel and resort booking',
        iconPosition: 'end',
    },
    {
        title: 'Photography & Media Coverage',
        description:
            'Capture your memories with our professional photography and drone services during your trip.',
        iconSrc: '/images/pages/home/Symbol (5).png',
        iconAlt: 'Photography and media coverage',
        iconPosition: 'start',
    },
    {
        title: 'Air Ticketing & Travel Assistance',
        description:
            'Hassle-free air ticket booking, itinerary planning, and complete travel guidance from start to end.',
        iconSrc: '/images/pages/home/Symbol (6).png',
        iconAlt: 'Air ticketing and travel assistance',
        iconPosition: 'end',
    },
    {
        title: 'Destination Wedding Management',
        description:
            "Plan your dream wedding in Pakistan's most scenic destinations with full arrangements handled by our expert team.",
        iconSrc: '/images/pages/home/Symbol (7).png',
        iconAlt: 'Destination wedding management',
        iconPosition: 'start',
    },
    {
        title: 'Pakistan Northern Tours',
        description:
            'Explore breathtaking destinations like Hunza, Skardu, and many more with our expertly guided tours tailored for unforgettable experiences.',
        iconSrc: '/images/pages/home/mountain.png',
        iconAlt: 'Pakistan northern tours',
        iconPosition: 'end',
    },
    {
        title: 'Customized Family Trips',
        description:
            'Family-friendly packages with safe transport, comfortable stays, and activities designed for all age groups.',
        iconSrc: '/images/pages/home/people.png',
        iconAlt: 'Customized family trips',
        iconPosition: 'start',
    },
]

function ServiceCard({ title, description, iconSrc, iconAlt, iconPosition }: ServiceItem) {
    const iconBlock = (
        <div className='relative h-16 w-16 shrink-0'>
            <Image
                src={iconSrc}
                alt={iconAlt}
                width={64}
                height={64}
                className='h-16 w-16 object-contain'
            />
        </div>
    )

    const textAlign = iconPosition === 'end' ? 'text-right' : 'text-left'

    const textBlock = (
        <div className={`min-w-0 flex-1 ${textAlign}`}>
            <h3 className='font-jost text-[20px] font-medium leading-6 tracking-normal text-[#14141F] pb-[26px]'>
                {title}
            </h3>
            <p className='pt-1 font-roboto text-base font-normal leading-6 tracking-normal text-[#757575]'>
                {description}
            </p>
        </div>
    )

    return (
        <article className='mx-auto flex w-full max-w-[636px] min-h-[162px] items-center rounded-[10px] border border-[#276968] bg-white px-[24px] py-4 shadow-sm'>
            <div className='flex w-full items-center gap-6'>
                {iconPosition === 'start' && iconBlock}
                {textBlock}
                {iconPosition === 'end' && iconBlock}
            </div>
        </article>
    )
}

const OurServices = () => {
    return (
        <section
            className='bg-[#F2F2F2] py-16 sm:py-20 lg:py-[96px] mb-[342px]'
            aria-labelledby='our-services-heading'
        >
            <div className='agency-container'>
                <header className='mx-auto max-w-2xl text-center'>
                    <SectionEyebrow name='Services' />
                    <h2
                        id='our-services-heading'
                        className='agency-section-heading text-[40px] leading-[48px] font-medium pt-3 text-[#14141F] sm:pt-4'
                    >
                        Our Services
                    </h2>
                </header>

                <div className='mx-auto grid w-full max-w-[1312px] grid-cols-1 gap-4 pt-8 sm:gap-5 sm:pt-8 md:grid-cols-2 md:pt-10 lg:gap-6 lg:pt-12'>
                    {services.map((service) => (
                        <ServiceCard key={service.title} {...service} />
                    ))}
                </div>

                <div className='flex justify-center pt-10 sm:pt-12 lg:pt-8'>
                    <Button
                        variant='default'
                        className='h-[58px] w-[219px] max-w-[219px] rounded-full border border-primary-600 bg-primary-600 px-8 text-sm font-medium text-white hover:bg-primary-700 sm:w-[219px] sm:text-base'
                    >
                        View All Services
                    </Button>
                </div>
            </div>
        </section>
    )
}

export default OurServices
