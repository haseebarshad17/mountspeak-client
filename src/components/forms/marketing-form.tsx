import { cn } from '@/lib/utils/clsxUtils'
import type { ReactNode } from 'react'

/** Shared booking / consultation form field shell. */
export const MARKETING_FORM_CONTROL_CLASS =
    'box-border h-11 w-full min-w-0 max-w-full rounded-[10px] border-0 bg-white px-4 font-roboto text-sm font-normal leading-6 tracking-normal text-neutral-900 shadow-sm outline-none transition-shadow placeholder:text-neutral-400 focus:ring-2 focus:ring-white/40 sm:text-base'

export const marketingFormInputClass = MARKETING_FORM_CONTROL_CLASS

export const marketingFormTextareaClass = cn(
    MARKETING_FORM_CONTROL_CLASS,
    '!h-auto min-h-[7rem] resize-none py-3 align-top sm:min-h-[7.25rem] sm:py-4',
)

export const marketingFormRowClass = 'grid min-w-0 grid-cols-1 gap-3 md:grid-cols-2 md:gap-4'

/** Light surface behind white form controls (contact page, etc.). */
export const marketingFormPanelClassName =
    'min-w-0 overflow-hidden rounded-[12px] border border-[#D5DADD] bg-[#EEF1F3] p-4 sm:rounded-[16px] sm:p-6'

type MarketingFormFieldProps = {
    label: string
    children: ReactNode
    className?: string
    error?: string
    errorColor?: string
}

export function MarketingFormField({
    label,
    children,
    className,
    error,
    errorColor = '#ffb4b4',
}: MarketingFormFieldProps) {
    return (
        <div className={cn('min-w-0 w-full', className)}>
            <label className='block min-w-0 w-full'>
                <span className='sr-only'>{label}</span>
                {children}
            </label>
            {error ? (
                <p className='mt-1 font-roboto text-xs' style={{ color: errorColor }} role='alert'>
                    {error}
                </p>
            ) : null}
        </div>
    )
}
