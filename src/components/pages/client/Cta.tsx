import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import { ctaContent } from './content'

const Cta = () => {
    return (
        <section className='bg-white px-4 py-12'>
            <div className='container'>
                <div className='mx-auto max-w-4xl text-center'>
                    <h2 className='text-3xl'>{ctaContent.title}</h2>
                    <p className='mb-8 mt-4 text-xl text-neutral-600'>{ctaContent.subtitle}</p>
                    <Link
                        href={ctaContent.buttonHref}
                        className='inline-flex items-center gap-2 rounded-md bg-[rgb(var(--color-primary-500))] px-8 py-4 text-white transition-colors hover:bg-[rgb(var(--color-primary-600))]'
                    >
                        {ctaContent.buttonLabel}
                        <ChevronRight className='h-5 w-5' />
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default Cta
