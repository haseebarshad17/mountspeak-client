import type { HomepagePage } from '@/data/homepage'
import type { OurServicesItem } from '@/services/homepage/homepage.page.types'
import Image from 'next/image'

type ServiceCardProps = OurServicesItem & {
    colors: HomepagePage['theme']['colors']
}

export function ServiceCard({
    title,
    description,
    iconSrc,
    iconAlt,
    iconPosition,
    colors,
}: ServiceCardProps) {
    const iconBlock = (
        <div className='relative h-16 w-16 shrink-0'>
            <Image
                src={iconSrc}
                alt={iconAlt}
                width={64}
                height={64}
                className='h-16 w-16 object-contain'
            />
        </div>
    )

    const textAlign = iconPosition === 'end' ? 'text-right' : 'text-left'

    const textBlock = (
        <div className={`min-w-0 flex-1 ${textAlign}`}>
            <h3
                className='pb-[26px] font-jost text-[20px] font-medium leading-6 tracking-normal'
                style={{ color: colors.title, fontFamily: 'var(--hp-font-heading)' }}
            >
                {title}
            </h3>
            <p
                className='pt-1 font-roboto text-base font-normal leading-6 tracking-normal'
                style={{ color: colors.text, fontFamily: 'var(--hp-font-body)' }}
            >
                {description}
            </p>
        </div>
    )

    return (
        <article
            className='mx-auto flex w-full max-w-[636px] min-h-[162px] items-center rounded-[10px] border bg-white px-[24px] py-4 shadow-sm'
            style={{ borderColor: colors.border }}
        >
            <div className='flex w-full items-center gap-6'>
                {iconPosition === 'start' && iconBlock}
                {textBlock}
                {iconPosition === 'end' && iconBlock}
            </div>
        </article>
    )
}
