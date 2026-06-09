'use client'

import { useEffect, useRef, useState } from 'react'

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
    const [open, setOpen] = useState(false)
    const rootRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!open) return

        const onPointerDown = (event: MouseEvent) => {
            if (!rootRef.current?.contains(event.target as Node)) {
                setOpen(false)
            }
        }

        const onEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setOpen(false)
            }
        }

        document.addEventListener('mousedown', onPointerDown)
        document.addEventListener('keydown', onEscape)

        return () => {
            document.removeEventListener('mousedown', onPointerDown)
            document.removeEventListener('keydown', onEscape)
        }
    }, [open])

    return (
        <div ref={rootRef} className='relative z-[120]'>
            <button
                type='button'
                aria-label='Open profile menu'
                aria-expanded={open}
                aria-haspopup='menu'
                onClick={() => setOpen((current) => !current)}
                className={cn(
                    'relative inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border transition outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                    useLightNav
                        ? 'border-[#C0C8C9] bg-white text-[#00292C] hover:bg-neutral-50 focus-visible:ring-[#00292C]/30'
                        : 'border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 focus-visible:ring-white/40',
                    triggerClassName,
                )}
            >
                <UserRound className='h-5 w-5' />
            </button>

            {open ? (
                <div
                    role='menu'
                    className='absolute right-0 top-full z-[200] mt-2 min-w-[180px] overflow-hidden rounded-md border border-[#C0C8C9]/60 bg-white p-1 text-[#1A1C1E] shadow-md'
                >
                    <Link
                        href='/dashboard'
                        role='menuitem'
                        className={cn(
                            'flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-[#1A1C1E] transition-colors hover:bg-neutral-50',
                            menuItemClassName,
                        )}
                        onClick={() => {
                            setOpen(false)
                            onNavigate?.()
                        }}
                    >
                        <LayoutDashboard className='h-4 w-4 shrink-0' />
                        Dashboard
                    </Link>
                    <div className='my-1 h-px bg-[#C0C8C9]/40' aria-hidden />
                    <button
                        type='button'
                        role='menuitem'
                        className={cn(
                            'flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-[#BA1A1A] transition-colors hover:bg-neutral-50',
                            menuItemClassName,
                        )}
                        onClick={() => {
                            setOpen(false)
                            void onLogout()
                        }}
                    >
                        <LogOut className='h-4 w-4 shrink-0' />
                        {logoutLabel}
                    </button>
                </div>
            ) : null}
        </div>
    )
}
