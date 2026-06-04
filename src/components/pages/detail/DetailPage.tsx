import { redirect } from 'next/navigation'

/** @deprecated Use /tours/[slug] instead */
export default function DetailPage(): null {
    redirect('/tours/hunza-fairy-meadows')
    return null
}
