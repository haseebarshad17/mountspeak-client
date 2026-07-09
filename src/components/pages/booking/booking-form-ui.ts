import { marketingFormFieldClass } from '@/components/forms/marketing-form'
import { accountFieldLabelClassName } from '@/components/pages/dashboard/account-ui'
import { cn } from '@/lib/utils/clsxUtils'

export const bookingFormPanelClassName =
    'mx-auto w-full max-w-[555px] rounded-[12px] border border-[#D5DADD] bg-[#EEF1F3] px-4 py-6 xs:px-5 sm:px-6 sm:py-8 xl:mx-0'

/** Clears the floating marketing header on /booking (tighter than dashboard shell). */
export const bookingPageTopPaddingClassName =
    'pt-[100px] sm:pt-[108px] md:pt-[116px] lg:pt-[124px]'

/** Extra breathing room between the header and the stepper. */
export { accountPageContentTopSpacingClassName as bookingStepperTopSpacingClassName } from '@/components/pages/dashboard/account-ui'

export const bookingFieldLabelClassName = accountFieldLabelClassName

export const bookingFieldInputClassName = marketingFormFieldClass

export const bookingFieldTextareaClassName = cn(
    marketingFormFieldClass,
    '!h-auto min-h-[96px] resize-none py-3 sm:min-h-[120px]',
)
