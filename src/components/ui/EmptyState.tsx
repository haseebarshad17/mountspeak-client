import { cn } from '@/lib/utils/cn'

export function EmptyState({
    title,
    description,
    className,
}: {
    title: string
    description?: string
    className?: string
}) {
    return (
        <div
            className={cn(
                'rounded-[24px] border border-dashed border-[#111]/10 bg-white/70 px-6 py-12 text-center',
                className
            )}
        >
            <p className="text-base font-semibold text-[#111]">{title}</p>
            {description ? (
                <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#666]">
                    {description}
                </p>
            ) : null}
        </div>
    )
}
