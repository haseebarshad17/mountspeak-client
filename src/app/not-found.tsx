import Link from 'next/link'

export default function NotFound() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-[#FCF8F3] px-4">
            <div className="max-w-md text-center">
                <p className="text-sm uppercase tracking-[0.16em] text-[#888]">404</p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#111]">
                    Page not found
                </h1>
                <p className="mt-3 text-sm text-[#666]">
                    The page you&apos;re looking for doesn&apos;t exist or is no longer available.
                </p>
                <Link
                    href="/"
                    className="mt-6 inline-flex rounded-full bg-[#111] px-5 py-2.5 text-sm font-medium text-white"
                >
                    Back home
                </Link>
            </div>
        </main>
    )
}
