import { redirect } from 'next/navigation'

type VerifyEmailPageProps = {
    searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function Page({ searchParams }: VerifyEmailPageProps) {
    const resolvedSearchParams = await searchParams
    const query = new URLSearchParams()

    const email = resolvedSearchParams.email
    if (typeof email === 'string' && email.trim()) {
        query.set('email', email.trim())
    }

    const next = resolvedSearchParams.next
    if (typeof next === 'string' && next.startsWith('/')) {
        query.set('next', next)
    }

    const queryString = query.toString()
    redirect(queryString ? `/login?${queryString}` : '/login')
}
