import { cn } from '@/lib/utils/clsxUtils'

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            className={cn('animate-pulse rounded-md bg-neutral-200/90', className)}
            {...props}
        />
    )
}

export { Skeleton }
