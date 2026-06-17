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

    return (
        <footer style={{ backgroundColor: footer.backgroundColor }}>
            <div className='agency-container'>
                <section className='flex flex-col gap-10 py-[60px] xl:flex-row lg:justify-between lg:gap-6 lg:py-[95px]'>
                    <div className='w-max flex-shrink-0 xl:pr-[150px] pr-[70px] pb-5'>
                        <Link href={homeHref}>
                            <Image
                                src={footer.logo.src}
                                alt={footer.logo.alt}
                                width={95}
                                height={100}
                                className='h-auto w-[95px]'
                            />
                        </Link>
                    </div>

                    <div className='grid flex-1 grid-cols-1 text-white xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                        {columns.map((item, idx) => (
                            <div key={idx}>
                                <h3 className='pb-3 text-base font-semibold sm:pb-4 sm:text-lg'>{item.title}</h3>
                                <ul className='flex flex-col gap-3'>
                                    {'links' in item && item.links
                                        ? item.links.map((category, linkIdx) => {
                                              if (!category.href) {
                                                  return (
                                                      <li
                                                          key={linkIdx}
                                                          className={cn(
                                                              'text-sm font-normal opacity-80 sm:text-base',
                                                          )}
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
                                                              'text-sm font-normal opacity-80 sm:text-base',
                                                              'hover:opacity-100 w-max',
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
                                                          className={cn(
                                                              'text-sm font-normal opacity-80 sm:text-base',
                                                          )}
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
                                                              'text-sm font-normal opacity-80 sm:text-base',
                                                              'hover:opacity-100 w-max',
                                                          )}
                                                      >
                                                          {category.label}
                                                      </FooterLink>
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
