import { marketingFormFieldClass } from '@/components/forms/marketing-form'
import { cn } from '@/lib/utils/clsxUtils'

export const accountCardClassName = 'rounded-xl border border-[#C0C8C9] bg-white'

/** Breathing room below the floating header on profile / bookings pages. */
export const accountPageContentTopSpacingClassName = 'mt-8 sm:mt-10 md:mt-12'

export const accountPageHeadingClassName =
    'text-3xl font-semibold leading-tight text-[#012b32] sm:text-4xl lg:text-5xl'

export const accountPageIntroClassName =
    'mt-2 max-w-[670px] text-sm leading-6 text-[#404849] sm:mt-3 sm:text-base'

export const accountFieldInputClassName = cn('mt-1', marketingFormFieldClass)

export const accountFieldLabelClassName =
    'text-[12px] font-medium uppercase tracking-[0.6px] text-[#707979]'

export const accountFormFieldsGridClassName =
    'grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4'
