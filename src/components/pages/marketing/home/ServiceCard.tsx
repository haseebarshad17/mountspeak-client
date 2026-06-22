import { HP_CSS_VARS, STATIC_UI_COLORS } from '@/data/homepage'
import type { OurServicesItem } from '@/services/homepage/homepage.page.types'
import { cn } from '@/lib/utils/clsxUtils'
import Image from 'next/image'

type ServiceCardProps = OurServicesItem

export function ServiceCard({
    title,
    description,
    iconSrc,
    iconAlt,
    iconPosition,
}: ServiceCardProps) {
    const iconBlock = (
        <div
            className={cn(
                'relative h-10 w-10 shrink-0 sm:h-16 sm:w-16',
                iconPosition === 'end' ? 'order-1 sm:order-2' : 'order-1',
            )}
        >
            <Image
                src={iconSrc}
                alt={iconAlt}
                width={64}
                height={64}
                className='h-10 w-10 object-contain sm:h-16 sm:w-16'
            />
        </div>
    )

    const textBlock = (
        <div
            className={cn(
                'min-w-0 flex-1 text-left',
                iconPosition === 'end' ? 'order-2 sm:order-1 sm:text-right' : 'order-2',
            )}
        >
            <h3
                className='pb-2 font-jost text-base font-medium leading-5 tracking-normal sm:pb-[26px] sm:text-[20px] sm:leading-6'
                style={{ color: STATIC_UI_COLORS.title, fontFamily: 'var(--hp-font-heading)' }}
            >
                {title}
            </h3>
            <p
                className='pt-0 font-roboto text-sm font-normal leading-5 tracking-normal sm:pt-1 sm:text-base sm:leading-6'
                style={{ color: STATIC_UI_COLORS.text, fontFamily: 'var(--hp-font-body)' }}
            >
                {description}
            </p>
        </div>
    )

    return (
        <article
            className='mx-auto flex w-full max-w-[636px] min-h-0 items-center rounded-[10px] border bg-white px-4 py-3 shadow-sm sm:min-h-[162px] sm:px-[24px] sm:py-4'
            style={{ borderColor: HP_CSS_VARS.primaryBorder }}
        >
            <div className='flex w-full items-center gap-3 sm:gap-6'>
                {iconBlock}
                {textBlock}
            </div>
        </article>
    )
}
