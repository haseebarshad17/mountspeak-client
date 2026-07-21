'use client'

import { AlertTriangle } from 'lucide-react'

import { selectHomepageSiteUrl, selectIsAgencySite } from '@/store/homepage/homepage.selectors'
import { useAppSelector } from '@/store/hooks'

export default function SiteThemeFallbackIndicator() {
    const isAgencySite = useAppSelector(selectIsAgencySite)
    const siteUrl = useAppSelector(selectHomepageSiteUrl)

    if (isAgencySite !== false) return null

    const currentHost =
        typeof window !== 'undefined' ? window.location.host : 'unknown'
    const configuredHost = siteUrl
        ? (() => {
              try {
                  return new URL(siteUrl).host
              } catch {
                  return siteUrl
              }
          })()
        : null

    const tooltip = [
        'Site URL not matched — showing default Mountspeak theme.',
        'Configure your domain in the agency dashboard.',
        `Current host: ${currentHost}`,
        configuredHost ? `Configured: ${configuredHost}` : null,
    ]
        .filter(Boolean)
        .join(' ')

    return (
        <div
            className="group fixed bottom-4 left-4 z-[60] flex items-center"
            aria-label={tooltip}
        >
            <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-amber-200 bg-amber-50 text-amber-700 shadow-md transition-colors hover:bg-amber-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50"
                aria-label={tooltip}
            >
                <AlertTriangle className="h-4 w-4" aria-hidden />
            </button>
            <div
                role="tooltip"
                className="pointer-events-none absolute bottom-full left-0 mb-2 hidden w-64 rounded-lg border border-amber-200 bg-white px-3 py-2 text-xs leading-relaxed text-[#434849] shadow-lg group-hover:block group-focus-within:block"
            >
                <p className="font-semibold text-amber-800">Default theme active</p>
                <p className="mt-1">
                    Site URL not matched — showing default Mountspeak theme. Configure your domain
                    in the agency dashboard.
                </p>
                <p className="mt-2 text-[11px] text-[#707979]">
                    Current: <span className="font-medium">{currentHost}</span>
                    {configuredHost ? (
                        <>
                            <br />
                            Configured: <span className="font-medium">{configuredHost}</span>
                        </>
                    ) : null}
                </p>
            </div>
        </div>
    )
}
