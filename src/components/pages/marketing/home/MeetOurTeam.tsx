import { SectionEyebrow } from '@/components/ui/section-eyebrow'
import Image from 'next/image'
import React from 'react'

const teamMembers = [
    {
        name: 'Waleed',
        role: 'CEO',
        image: 'https://i.pravatar.cc/400?img=11',
    },
    {
        name: 'Hamayun',
        role: 'Adventure & Trekking Guide',
        image: 'https://i.pravatar.cc/400?img=12',
    },
    {
        name: 'Saif',
        role: 'Mountain Expedition Leader',
        image: 'https://i.pravatar.cc/400?img=15',
    },
    {
        name: 'Ali',
        role: 'Tour Guide',
        image: 'https://i.pravatar.cc/400?img=20',
    },
] as const

function TeamCard({ name, role, image }: { name: string; role: string; image: string }) {
    return (
        <article className='overflow-hidden rounded-2xl bg-neutral-100 shadow-sm max-w-[306px] w-full h-[424px]'>
            <div className='relative aspect-[3/4] w-full bg-neutral-200 h-[300px]'>
                <Image
                    src={image}
                    alt={name}
                    fill
                    className='object-cover object-top'
                    sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw'
                />
            </div>
            <div className='bg-[#F2F2F2] px-4 py-5 text-center sm:px-5 sm:py-6 max-w-[306px] h-[124px]'>
                <h3 className='font-jost text-xl font-medium leading-7 text-[#14141F] sm:text-2xl'>{name}</h3>
                <p className='pt-1 font-roboto text-sm font-normal leading-6 text-neutral-500 sm:text-base'>
                    {role}
                </p>
            </div>
        </article>
    )
}

const MeetOurTeam = () => {
    return (
        <section className='bg-white pb-16 sm:pb-20 lg:pb-[192px]' aria-labelledby='meet-our-team-heading'>
            <div className='agency-container'>
                <header className='mx-auto max-w-3xl text-center'>
                    <SectionEyebrow name='Travel Guide' />
                    <h2
                        id='meet-our-team-heading'
                        className='agency-section-heading pt-3 text-[40px] font-medium leading-[48px] text-[#14141F] sm:pt-4'
                    >
                        Meet Our Team
                    </h2>
                </header>

                <div className='mx-auto grid max-w-[1200px] grid-cols-1 gap-6 pt-10 sm:grid-cols-2 sm:gap-8 sm:pt-12 lg:grid-cols-4 lg:gap-8 lg:pt-14'>
                    {teamMembers.map((member) => (
                        <TeamCard key={member.name} {...member} />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default MeetOurTeam
