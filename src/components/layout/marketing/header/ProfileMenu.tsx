'use client'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils/clsxUtils'
import { LayoutDashboard, LogOut, UserRound } from 'lucide-react'
import Link from 'next/link'

export type ProfileMenuProps = {
    useLightNav: boolean
    logoutLabel: string
    onLogout: () => void | Promise<void>
    onNavigate?: () => void
    triggerClassName?: string
    menuItemClassName?: string
}

export function ProfileMenu({
    useLightNav,
    logoutLabel,
    onLogout,
    onNavigate,
    triggerClassName,
    menuItemClassName,
}: ProfileMenuProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    type='button'
                    aria-label='Open profile menu'
                    className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-full border transition outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                        useLightNav
                            ? 'border-[#C0C8C9] bg-white text-[#00292C] hover:bg-neutral-50 focus-visible:ring-[#00292C]/30'
                            : 'border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 focus-visible:ring-white/40',
                        triggerClassName,
                    )}
                >
                    <UserRound className='h-5 w-5' />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='z-[120] min-w-[180px]'>
                <DropdownMenuItem asChild className={cn('cursor-pointer', menuItemClassName)}>
                    <Link href='/dashboard' onClick={onNavigate}>
                        <LayoutDashboard className='h-4 w-4' />
                        Dashboard
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className={cn('cursor-pointer text-[#BA1A1A] focus:text-[#BA1A1A]', menuItemClassName)}
                    onClick={onLogout}
                >
                    <LogOut className='h-4 w-4' />
                    {logoutLabel}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
