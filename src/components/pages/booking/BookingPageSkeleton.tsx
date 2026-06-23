import { BookingHeaderSection } from '@/components/pages/booking/BookingHeaderSection'
import { Skeleton } from '@/components/ui/skeleton'

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
        <>
            <BookingHeaderSection />

            <div className='agency-container pb-16 pt-10 xs:pt-12 sm:pb-20 sm:pt-14 md:pt-16 lg:pb-24 xl:pt-20'>
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

                <div className='mt-10 grid items-start gap-10 xs:mt-12 sm:mt-14 xl:mt-16 xl:grid-cols-[minmax(0,455px)_minmax(0,555px)] xl:justify-center xl:gap-16 2xl:gap-24'>
                    <div className='mx-auto w-full max-w-[455px] xl:mx-0'>
                        <Skeleton className='h-12 w-full max-w-[320px]' />
                        <Skeleton className='mt-3 h-12 w-full max-w-[280px]' />
                        <Skeleton className='mt-5 h-5 w-full max-w-[420px]' />
                        <Skeleton className='mt-2 h-5 w-full max-w-[380px]' />
                        <Skeleton className='mt-7 h-[190px] w-full rounded-[3px] xs:h-[220px] sm:mt-8 sm:h-[250px]' />
                    </div>

                    <div className='mx-auto w-full max-w-[555px] rounded-[10px] border border-neutral-300 bg-white px-4 py-6 xs:px-5 sm:px-9 sm:py-9 xl:mx-0'>
                        <BookingFormSkeleton />
                    </div>
                </div>
            </div>
        </>
    )
}
