import Image from 'next/image'

type OnboardIntroProps = {
    description: string
    image: string
    imageAlt: string
    titleLines: readonly string[]
    quote?: string
}

export function OnboardIntro({
    description,
    image,
    imageAlt,
    titleLines,
    quote,
}: OnboardIntroProps) {
    return (
        <div className='mx-auto w-full max-w-[455px] xl:mx-0'>
            <h2
                className='text-[28px] font-semibold leading-tight text-neutral-800 xs:text-[32px] sm:text-[44px] md:text-[52px] xl:text-[64px] xl:leading-[0.98]'
            >
                {titleLines.map((line) => (
                    <span
                        key={line}
                        className='mr-2 inline-block'
                    >
                        {line}
                    </span>
                ))}
            </h2>
            <p className='mt-4 max-w-[455px] text-sm leading-5 text-neutral-700 sm:mt-5 sm:text-base sm:leading-6'>{description}</p>

            <div className='relative mt-7 h-[190px] w-full overflow-hidden rounded-[3px] shadow-xl xs:h-[220px] sm:mt-8 sm:h-[250px]'>
                <Image
                    src={image}
                    alt={imageAlt}
                    fill
                    className='object-cover'
                    sizes='(min-width: 1024px) 455px, 100vw'
                />
                {quote && (
                    <div className='absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-5 pb-5 pt-16'>
                        <p className='max-w-[350px] text-sm leading-5 text-white'>&quot;{quote}&quot;</p>
                    </div>
                )}
            </div>
        </div>
    )
}
