'use client'

import { Toaster } from 'sonner'

import { cn } from '@/lib/utils/clsxUtils'

export function AppToaster() {
    return (
        <Toaster
            position='bottom-right'
            closeButton
            gap={12}
            offset={20}
            visibleToasts={3}
            toastOptions={{
                duration: 4500,
                classNames: {
                    toast: cn(
                        'app-toast group w-[min(100%,calc(100vw-2rem))] rounded-xl border px-4 py-3.5 sm:min-w-[320px] sm:max-w-[420px]',
                        'border-[#E3E8EA] bg-white text-[#1A1C1E] shadow-[0_10px_30px_rgba(0,41,44,0.12)]',
                        'data-[type=error]:border-[#FECACA] data-[type=error]:bg-[#FEF2F2] data-[type=error]:text-[#7F1D1D]',
                        'data-[type=success]:border-[#BBF7D0] data-[type=success]:bg-[#F0FDF4] data-[type=success]:text-[#14532D]',
                    ),
                    title: 'text-sm font-semibold leading-5',
                    description: 'text-xs leading-5 text-[#404849]',
                    actionButton:
                        'rounded-md bg-[var(--hp-color-primary)] px-3 py-1.5 text-xs font-semibold text-white',
                    cancelButton:
                        'rounded-md border border-[#E3E8EA] bg-white px-3 py-1.5 text-xs font-semibold text-[#404849]',
                    closeButton:
                        'left-auto right-2 top-2 border border-[#E3E8EA] bg-white text-[#404849] hover:bg-[#F4F7F8]',
                },
            }}
        />
    )
}
