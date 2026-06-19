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
