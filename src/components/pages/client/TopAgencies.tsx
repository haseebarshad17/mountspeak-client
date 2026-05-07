import { Award, Star } from 'lucide-react'
import React from 'react'

import { topAgencies, topAgenciesSectionContent } from './content'

const TopAgencies = () => {
    return (
        <section className='px-4 py-12'>
            <div className='container'>
                <div className='mb-8'>
                    <h2 className='text-3xl'>{topAgenciesSectionContent.title}</h2>
                    <p className='mt-2 text-neutral-600'>{topAgenciesSectionContent.subtitle}</p>
                </div>

                <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
                    {topAgencies.map((agency) => (
                        <article key={agency.name} className='rounded-lg bg-white p-6 transition-all hover:shadow-lg'>
                            <div className='mb-4 flex items-center justify-between'>
                                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-[rgb(var(--color-primary-100))] text-lg font-medium text-[rgb(var(--color-primary-600))]'>
                                    {agency.name.charAt(0)}
                                </div>
                                {agency.verified && <Award className='h-5 w-5 text-green-600' />}
                            </div>

                            <h3 className='font-medium'>{agency.name}</h3>
                            <div className='mb-2 mt-2 flex items-center gap-2'>
                                <Star className='h-4 w-4 fill-yellow-400 text-yellow-400' />
                                <span className='font-medium'>{agency.rating}</span>
                            </div>
                            <p className='text-sm text-neutral-600'>{agency.tours} tours available</p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default TopAgencies
