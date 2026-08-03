'use client'

import { Bookmark, CalendarDays, UserRound } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { AgencyLink } from '@/components/links/AgencyLink'
import { useTemplateVariant } from '@/hooks/useTemplateVariant'
import { activeNavClass } from '@/lib/templates/chrome'
import { cn } from '@/lib/utils/cn'

const LINKS = [
    { label: 'Profile', href: '/account/profile', icon: UserRound },
    { label: 'Bookings', href: '/account/bookings', icon: CalendarDays },
    { label: 'Saved', href: '/account/saved', icon: Bookmark },
] as const

export function AccountSidebar() {
    const pathname = usePathname()
    const variant = useTemplateVariant()

    return (
        <aside className="w-full md:w-[240px] md:shrink-0">
            <p
                className={
                    variant === 'temp3'
                        ? 'px-2 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-t3-gold'
                        : 'px-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#888]'
                }
            >
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
                                'inline-flex min-h-11 shrink-0 items-center gap-2.5 md:w-full',
                                activeNavClass(active, variant)
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
