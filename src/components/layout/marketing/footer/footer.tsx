import { cn } from '@/lib/utils/clsxUtils';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

const Footer = () => {

    const FooterNavigationLinks = [
        {
            title: "Links",
            categories: [
                { label: "Flights", href: "/flights" },
                { label: "Stays", href: "/stays" },
                { label: "Discover", href: "/discover" },
                { label: "About Us", href: "/about" },
                { label: "Contact", href: "/contact" },
            ],
        },
        {
            title: "Our Activities",
            categories: [
                { label: "Tour", href: "/tour" },
                { label: "Kayaking", href: "/kayaking" },
                { label: "Cruising & Sailing", href: "/cruising-sailing" },
                { label: "Multi-activities", href: "/multi-activities" },
            ],
        },
        {
            title: "About Us",
            categories: [
                { label: "Our Story", href: "/our-story" },
                { label: "Work with us", href: "/careers" },
            ],
        },
        {
            title: "Contact",
            categories: [
                { label: "Address: Pe.Holandia No.205A", href: "#" },
                { label: "Millennium City, PH17", href: "#" },
                { label: "Phone: 023 456 7890", href: "tel:0234567890" },
                { label: "Email: phnes.travels@gmail.com", href: "mailto:phnes.travels@gmail.com" },
                { label: "Maps: Millennium City, Accra", href: "https://maps.google.com" },
            ],
        },
    ];


    return (
        <footer className='bg-primary-500'>
            <div className='agency-container'>
                <section className='flex flex-col gap-10 py-12 sm:py-14 lg:flex-row lg:justify-between lg:gap-6 lg:py-[95px]'>
                    <div className='w-full max-w-[381px]'>
                        <a href="/">
                            <Image
                                src='/images/generic/agency-logo.png'
                                alt='logo'
                                width={100}
                                height={100}
                              className='h-auto w-[60px] sm:w-[70px] lg:w-[80px] xlw-[95px]'
                            />
                        </a>
                    </div>

                    <div className='grid flex-1 grid-cols-1 gap-8 text-white xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-10'>
                        {FooterNavigationLinks.map((item, idx) => (
                            <div key={idx}>
                                <h3 className='pb-3 text-base font-semibold sm:pb-4 sm:text-lg'>{item.title}</h3>
                                <ul className='flex flex-col gap-3'>
                                    {item.categories.map((category, idx) => {

                                        if (item.title === 'Contact') {
                                            return (
                                                <li
                                                    key={idx}
                                                    className={cn(
                                                        'text-sm font-normal opacity-80 sm:text-base',
                                                    )}
                                                >
                                                    {category.label}
                                                </li>
                                            )
                                        }

                                        return (
                                            <li key={idx}>
                                                <Link
                                                    href={category.href}
                                                    className={cn(
                                                        'text-sm font-normal opacity-80 sm:text-base',
                                                        'hover:opacity-100 w-max'
                                                    )}
                                                >
                                                    {category.label}
                                                </Link>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </div>
                        ))}

                    </div>
                </section>
            </div>
        </footer>
    )
}

export default Footer