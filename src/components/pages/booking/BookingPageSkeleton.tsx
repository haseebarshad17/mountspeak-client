import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils/clsxUtils'

import { bookingFormPanelClassName, bookingPageTopPaddingClassName, bookingStepperTopSpacingClassName } from './booking-form-ui'

function BookingFormSkeleton() {
    return (
        <div className='flex flex-col gap-6'>
            <Skeleton className='h-12 w-full' />
            <Skeleton className='h-12 w-full' />
            <div className='grid gap-6 sm:grid-cols-2'>
                <Skeleton className='h-12 w-full' />
                <Skeleton className='h-12 w-full' />
            </div>
            <Skeleton className='h-12 w-full' />
            <Skeleton className='h-24 w-full' />
            <Skeleton className='ml-auto h-12 w-full rounded-full sm:w-[180px]' />
        </div>
    )
}

export function BookingPageSkeleton() {
    return (
        <div className={cn('agency-container pb-16 sm:pb-20 lg:pb-24', bookingPageTopPaddingClassName)}>
            <div className={bookingStepperTopSpacingClassName}>
                <div className='flex w-full justify-center'>
                    <div className='flex items-start'>
                        {[0, 1].map((index) => (
                            <div key={index} className='flex items-start'>
                                <div className='flex w-[88px] flex-col items-center gap-2 sm:w-[104px]'>
                                    <Skeleton className='h-8 w-8 rounded-[9px]' />
                                    <Skeleton className='h-3 w-14' />
                                </div>
                                {index === 0 ? <Skeleton className='mt-4 h-px w-16 sm:w-24 md:w-32' /> : null}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className='mt-10 grid items-start gap-10 xs:mt-12 sm:mt-14 xl:mt-16 xl:grid-cols-[minmax(0,455px)_minmax(0,555px)] xl:justify-center xl:gap-16 2xl:gap-24'>
                <div className='mx-auto w-full max-w-[455px] xl:mx-0'>
                    <Skeleton className='h-12 w-full max-w-[320px]' />
                    <Skeleton className='mt-3 h-12 w-full max-w-[280px]' />
                    <Skeleton className='mt-5 h-5 w-full max-w-[420px]' />
                    <Skeleton className='mt-2 h-5 w-full max-w-[380px]' />
                    <Skeleton className='mt-7 h-[190px] w-full rounded-[3px] xs:h-[220px] sm:mt-8 sm:h-[250px]' />
                </div>

                <div className={bookingFormPanelClassName}>
                    <BookingFormSkeleton />
                </div>
            </div>
        </div>
    )
}
