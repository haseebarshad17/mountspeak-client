import { Jost, Roboto } from 'next/font/google'

export const jost = Jost({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    display: 'swap',
    variable: '--font-jost',
})

export const roboto = Roboto({
    subsets: ['latin'],
    weight: ['300', '400', '500', '700'],
    display: 'swap',
    variable: '--font-roboto',
})
