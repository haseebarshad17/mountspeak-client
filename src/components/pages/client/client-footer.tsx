import { Mail, MapPin, Phone } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import { clientFooterContent } from './content'

const ClientFooter = () => {
    return (
        <footer className='bg-gradient-to-br from-neutral-900 to-neutral-800 px-4 py-20 text-white'>
            <div className='container'>
                <div className='mb-12 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4'>
                    <div>
                        <div className='mb-6 flex items-center gap-2'>
                            <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[rgb(var(--color-primary-400))] to-[rgb(var(--color-primary-600))]'>
                                <span className='text-xl font-bold text-white'>T</span>
                            </div>
                            <span className='text-2xl tracking-tight'>{clientFooterContent.brand}</span>
                        </div>
                        <p className='leading-relaxed text-neutral-400'>{clientFooterContent.description}</p>
                    </div>

                    {clientFooterContent.columns.map((column) => (
                        <div key={column.title}>
                            <h4 className='mb-4 text-lg'>{column.title}</h4>
                            <ul className='space-y-3'>
                                {column.links.map((linkItem) => (
                                    <li key={linkItem.label}>
                                        <Link href={linkItem.href} className='text-neutral-400 transition-colors hover:text-white'>
                                            {linkItem.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    <div>
                        <h4 className='mb-4 text-lg'>Contact</h4>
                        <ul className='space-y-3'>
                            <li className='flex items-center gap-3 text-neutral-400'>
                                <Mail className='h-5 w-5' />
                                <span>{clientFooterContent.contact.email}</span>
                            </li>
                            <li className='flex items-center gap-3 text-neutral-400'>
                                <Phone className='h-5 w-5' />
                                <span>{clientFooterContent.contact.phone}</span>
                            </li>
                            <li className='flex items-center gap-3 text-neutral-400'>
                                <MapPin className='h-5 w-5' />
                                <span>{clientFooterContent.contact.address}</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className='border-t border-neutral-700 pt-8'>
                    <div className='flex flex-col items-center justify-between gap-4 md:flex-row'>
                        <p className='text-sm text-neutral-400'>{clientFooterContent.copyright}</p>
                        <div className='flex gap-6 text-sm text-neutral-400'>
                            {clientFooterContent.legalLinks.map((linkItem) => (
                                <Link key={linkItem.label} href={linkItem.href} className='transition-colors hover:text-white'>
                                    {linkItem.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default ClientFooter
