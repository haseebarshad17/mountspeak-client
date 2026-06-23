import {
    HP_THEME_INPUT_FOCUS_CLASS,
    HP_THEME_LINK_CLASS,
    HP_THEME_TAB_ACTIVE_CLASS,
    HP_THEME_TAB_INACTIVE_CLASS,
    HP_THEME_TAB_INDICATOR_CLASS,
} from '@/data/homepage'
import { cn } from '@/lib/utils/clsxUtils'

export const authInputClassName = cn(
    'w-full border-b bg-transparent px-3 py-2 min-h-[40px] text-base text-[#161b1d] outline-none transition placeholder:text-[#a0a4a8]',
    HP_THEME_INPUT_FOCUS_CLASS,
)

export const authInputBorderClassName = 'border-[#6B7280]'

export const authPasswordToggleClassName = cn(
    'absolute right-1 top-1/2 -translate-y-1/2 p-1 text-[#6B7280] transition',
    HP_THEME_LINK_CLASS,
)

export {
    HP_THEME_LINK_CLASS,
    HP_THEME_TAB_ACTIVE_CLASS,
    HP_THEME_TAB_INACTIVE_CLASS,
    HP_THEME_TAB_INDICATOR_CLASS,
}

export const authPageSectionClassName = 'flex min-h-dvh w-full justify-center'

export const authPageShellClassName =
    'flex min-h-dvh w-full max-w-full flex-col border-none bg-white md:h-dvh md:min-h-0 md:flex-row md:overflow-hidden'

export const authFormPanelClassName =
    'flex min-h-0 w-full flex-1 overflow-y-auto md:w-1/2'

export const authFormPanelInnerClassName =
    'flex min-h-full w-full flex-col bg-white px-6 py-10 sm:px-10 lg:px-[100px]'

/** Centers when content fits; scrolls from top when content overflows. */
export const authFormContentClassName = 'm-auto w-full max-w-[500px]'
