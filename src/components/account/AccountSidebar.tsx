'use client'

import { Bookmark, CalendarDays, UserRound } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { AgencyLink } from '@/components/links/AgencyLink'
import { cn } from '@/lib/utils/cn'

const LINKS = [
    { label: 'Profile', href: '/account/profile', icon: UserRound },
    { label: 'Bookings', href: '/account/bookings', icon: CalendarDays },
    { label: 'Saved', href: '/account/saved', icon: Bookmark },
] as const

export function AccountSidebar() {
    const pathname = usePathname()

    return (
        <aside className="w-full md:w-[240px] md:shrink-0">
            <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#888]">
                Account
            </p>
            <nav className="mt-3 flex gap-2 overflow-x-auto md:block md:space-y-1 md:overflow-visible">
                {LINKS.map((link) => {
                    const active =
                        pathname === link.href ||
                        pathname.startsWith(`${link.href}/`)
                    return (
                        <AgencyLink
                            key={link.href}
                            href={link.href}
                            className={cn(
                                'inline-flex min-h-11 shrink-0 items-center gap-2.5 rounded-xl px-3.5 text-sm transition md:w-full',
                                active
                                    ? 'bg-[#111] font-medium text-white'
                                    : 'bg-white text-[#333] hover:bg-[#F4F0EA] md:bg-transparent'
                            )}
                        >
                            <link.icon className="h-4 w-4" />
                            {link.label}
                        </AgencyLink>
                    )
                })}
            </nav>
        </aside>
    )
}
