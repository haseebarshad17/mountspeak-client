export default function Loading() {
    return (
        <div className="mx-auto w-full max-w-[1100px] px-4 py-10 sm:px-6 sm:py-12" aria-hidden>
            <div className="h-10 w-48 animate-pulse rounded-lg bg-neutral-200" />
            <div className="mt-4 h-5 w-full max-w-xl animate-pulse rounded bg-neutral-100" />
            <div className="mt-8 space-y-4">
                <div className="h-40 animate-pulse rounded-xl bg-neutral-100" />
                <div className="h-40 animate-pulse rounded-xl bg-neutral-100" />
            </div>
        </div>
    )
}
