import { cn } from '@/lib/utils/clsxUtils'

/**
 * Height-led logo sizing keeps wide and tall brand marks balanced.
 * Unscrolled: hero / top-of-page — larger presence.
 * Scrolled: compact bar — readable without dominating the nav row.
 */
export function headerLogoClassName(isScrolled: boolean) {
    return cn(
        'block w-auto object-contain object-left transition-[height,max-width] duration-300 ease-out',
        isScrolled
            ? [
                'h-[46px] max-w-[7.5rem]',
                'xs:h-12 xs:max-w-[8rem]',
                'sm:h-12 sm:max-w-[8.25rem]',
                'md:h-[50px] md:max-w-[8.75rem]',
                'lg:h-[52px] lg:max-w-[9.25rem]',
                'xl:h-[54px] xl:max-w-[9.5rem]',
            ]
            : [
                'h-16 max-w-[9.5rem]',
                'xs:h-[4.25rem] xs:max-w-[10rem]',
                'sm:h-[4.5rem] sm:max-w-[10.75rem]',
                'md:h-[4.75rem] md:max-w-[11.25rem]',
                'lg:h-20 lg:max-w-[12rem]',
                'xl:h-[5.25rem] xl:max-w-[12.75rem]',
                '2xl:h-[5.5rem] 2xl:max-w-[13.25rem]',
            ],
    )
}

/** Mobile drawer header — aligned with the scrolled bar scale, a touch roomier for the drawer row. */
export function mobileDrawerLogoClassName() {
    return cn(
        'block w-auto object-contain object-left',
        'h-12 max-w-[8.25rem]',
        'sm:h-[50px] sm:max-w-[8.75rem]',
        'md:h-[52px] md:max-w-[9.25rem]',
    )
}
