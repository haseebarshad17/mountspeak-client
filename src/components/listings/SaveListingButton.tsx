'use client'

import { Heart } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useOptionalUser } from '@/services/auth/auth.query'
import {
    isListingSaved,
    toggleSavedListing,
} from '@/services/saved-listings/saved-listings.store'
import type { ListingItem } from '@/services/listings/listings.types'
import { isValidAgencyId } from '@/services/specialization/specialization.service'
import { cn } from '@/lib/utils/cn'

export function SaveListingButton({
    item,
    agencyId,
    className,
}: {
    item: ListingItem
    agencyId?: string
    className?: string
}) {
    const { data: user } = useOptionalUser()
    const scopedId = isValidAgencyId(agencyId) ? agencyId! : 'default'
    const [saved, setSaved] = useState(false)

    useEffect(() => {
        if (!user?.id) {
            setSaved(false)
            return
        }
        setSaved(isListingSaved(user.id, scopedId, item.id))
        const onChange = () =>
            setSaved(isListingSaved(user.id, scopedId, item.id))
        window.addEventListener('mountspeak:saved-changed', onChange)
        return () => window.removeEventListener('mountspeak:saved-changed', onChange)
    }, [user?.id, scopedId, item.id])

    function onToggle(event: React.MouseEvent) {
        event.preventDefault()
        event.stopPropagation()
        if (!user?.id) {
            toast.message('Sign in to save trips', {
                description: 'Create a free account to bookmark tours and packages.',
                action: {
                    label: 'Log in',
                    onClick: () => {
                        const params = new URLSearchParams()
                        params.set('next', '/account/saved')
                        const host = new URLSearchParams(window.location.search).get(
                            'host'
                        )
                        if (host) params.set('host', host)
                        window.location.href = `/login?${params.toString()}`
                    },
                },
            })
            return
        }
        const nowSaved = toggleSavedListing(user.id, scopedId, {
            id: item.id,
            kind: item.kind,
            title: item.title,
            location: item.location,
            priceLabel: item.priceLabel,
            imageUrl: item.imageUrl,
            href: item.href,
        })
        setSaved(nowSaved)
        toast.success(nowSaved ? 'Saved to your list' : 'Removed from saved')
    }

    return (
        <button
            type="button"
            aria-label={saved ? 'Remove from saved' : 'Save listing'}
            onClick={onToggle}
            className={cn(
                'inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#111] shadow-sm backdrop-blur transition hover:bg-white',
                saved && 'text-brand',
                className
            )}
        >
            <Heart className={cn('h-3.5 w-3.5', saved && 'fill-current')} />
        </button>
    )
}
