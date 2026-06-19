'use client'

import { cn } from '@/lib/utils/clsxUtils'
import type { HomepagePage } from '@/data/homepage'
import { getFooterDisplayColumns } from '@/lib/homepage/normalize-homepage'
import { usePrefixedHref } from '@/hooks/useAgencyPreviewBase'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

type FooterProps = {
    footer: HomepagePage['footer']
}

function FooterLink({
    href,
    className,
    children,
}: {
    href: string
    className: string
    children: React.ReactNode
}) {
    const resolvedHref = usePrefixedHref(href) ?? href

    return (
        <Link href={resolvedHref} className={className}>
            {children}
        </Link>
    )
}

const Footer = ({ footer }: FooterProps) => {
    const homeHref = usePrefixedHref('/') ?? '/'
    const columns = getFooterDisplayColumns(footer)
    const contactColumnIndex = columns.length - 1

    const renderColumn = (item: (typeof columns)[number], idx: number) => (
        <div
            key={idx}
            className={cn(
                idx === contactColumnIndex && 'col-span-3 sm:col-span-1',
            )}
        >
            <h3 className='pb-2 text-sm font-semibold sm:pb-4 sm:text-lg'>{item.title}</h3>
            <ul className='flex flex-col gap-2 sm:gap-3'>
                {'links' in item && item.links
                    ? item.links.map((category, linkIdx) => {
                          if (!category.href) {
                              return (
                                  <li
                                      key={linkIdx}
                                      className={cn('text-xs font-normal opacity-80 sm:text-base')}
                                  >
                                      {category.label}
                                  </li>
                              )
                          }

                          return (
                              <li key={linkIdx}>
                                  <FooterLink
                                      href={category.href}
                                      className={cn(
                                          'text-xs font-normal opacity-80 sm:text-base',
                                          'hover:opacity-100 w-max max-w-full',
                                      )}
                                  >
                                      {category.label}
                                  </FooterLink>
                              </li>
                          )
                      })
                    : (item.items ?? []).map((category, linkIdx) => {
                          if (!category.href) {
                              return (
                                  <li
                                      key={linkIdx}
                                      className={cn('text-xs font-normal opacity-80 sm:text-base')}
                                  >
                                      {category.label}
                                  </li>
                              )
                          }

                          return (
                              <li key={linkIdx}>
                                  <FooterLink
                                      href={category.href}
                                      className={cn(
                                          'text-xs font-normal opacity-80 sm:text-base',
                                          'hover:opacity-100 w-max max-w-full',
                                      )}
                                  >
                                      {category.label}
                                  </FooterLink>
                              </li>
                          )
                      })}
            </ul>
        </div>
    )

    return (
        <footer style={{ backgroundColor: footer.backgroundColor }}>
            <div className='agency-container'>
                <section className='flex flex-col gap-8 py-12 sm:gap-10 sm:py-[60px] xl:flex-row lg:justify-between lg:gap-6 lg:py-[95px]'>
                    <div className='mx-auto w-max flex-shrink-0 pb-2 sm:mx-0 sm:pb-5 sm:pr-[70px] xl:pr-[150px]'>
                        <Link href={homeHref} className='inline-block'>
                            <Image
                                src={footer.logo.src}
                                alt={footer.logo.alt}
                                width={95}
                                height={100}
                                className='h-auto w-[95px]'
                            />
                        </Link>
                    </div>

                    <div className='grid flex-1 grid-cols-3 gap-x-3 gap-y-5 text-white sm:grid-cols-2 sm:gap-x-4 sm:gap-y-6 md:grid-cols-3 lg:grid-cols-4 lg:gap-4'>
                        {columns.map(renderColumn)}
                    </div>
                </section>
            </div>
        </footer>
    )
}

export default Footer
