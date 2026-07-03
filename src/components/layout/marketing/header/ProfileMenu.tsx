'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

import { HP_CSS_VARS } from '@/data/homepage'
import { cn } from '@/lib/utils/clsxUtils'
import { getProfileInitials } from '@/lib/profile/profile-initials'
import { resolveProfileAvatarUrl } from '@/lib/profile/avatar-url'
import { useOptionalUserProfile } from '@/services/auth/auth.queries'
import { BookMarked, LogOut, UserRound } from 'lucide-react'

import { PrefixedLink } from '@/components/ui/prefixed-link'

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
    const { data: profile } = useOptionalUserProfile()
    const avatarUrl = resolveProfileAvatarUrl(profile?.avatar_url)
    const initials = getProfileInitials(profile?.full_name)
    const showAvatar = Boolean(avatarUrl)

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
                    'relative inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border transition outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                    showAvatar
                        ? cn(
                              'p-0',
                              useLightNav
                                  ? 'border-[#C0C8C9] bg-white hover:bg-neutral-50 focus-visible:ring-[#00292C]/30'
                                  : 'border-white/30 bg-white/10 backdrop-blur-sm hover:bg-white/20 focus-visible:ring-white/40',
                          )
                        : 'border-transparent p-0 focus-visible:ring-[var(--hp-color-primary)]/40',
                    triggerClassName,
                )}
                style={
                    showAvatar
                        ? undefined
                        : {
                              backgroundColor: HP_CSS_VARS.primary,
                              color: HP_CSS_VARS.primaryText,
                          }
                }
            >
                {showAvatar ? (
                    <Image
                        src={avatarUrl!}
                        alt='Profile photo'
                        width={40}
                        height={40}
                        className='h-full w-full object-cover'
                    />
                ) : (
                    <span className='font-roboto text-sm font-semibold uppercase leading-none tracking-wide'>
                        {initials}
                    </span>
                )}
            </button>

            {open ? (
                <div
                    role='menu'
                    className='absolute right-0 top-full z-[200] mt-2 min-w-[180px] overflow-hidden rounded-md border border-[#C0C8C9]/60 bg-white p-1 text-[#1A1C1E] shadow-md'
                >
                    <PrefixedLink
                        href='/dashboard'
                        role='menuitem'
                        className={cn(
                            'flex w-full items-center justify-start gap-2 rounded-sm px-2 py-1.5 text-sm text-[#1A1C1E] transition-colors hover:bg-neutral-50',
                            menuItemClassName,
                        )}
                        onClick={() => {
                            setOpen(false)
                            onNavigate?.()
                        }}
                    >
                        <UserRound className='h-4 w-4 shrink-0' />
                        Profile
                    </PrefixedLink>
                    <PrefixedLink
                        href='/bookings'
                        role='menuitem'
                        className={cn(
                            'flex w-full items-center justify-start gap-2 rounded-sm px-2 py-1.5 text-sm text-[#1A1C1E] transition-colors hover:bg-neutral-50',
                            menuItemClassName,
                        )}
                        onClick={() => {
                            setOpen(false)
                            onNavigate?.()
                        }}
                    >
                        <BookMarked className='h-4 w-4 shrink-0' />
                        Bookings
                    </PrefixedLink>
                    <div className='my-1 h-px bg-[#C0C8C9]/40' aria-hidden />
                    <button
                        type='button'
                        role='menuitem'
                        className={cn(
                            'flex w-full items-center justify-start gap-2 rounded-sm px-2 py-1.5 text-sm text-[#BA1A1A] transition-colors hover:bg-neutral-50',
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
