import { redirect } from 'next/navigation'

/** @deprecated Use /tours/[slug] instead */
export default function DetailPage() {
    redirect('/tours/hunza-fairy-meadows')
}
