import {
    Fraunces,
    IBM_Plex_Mono,
    Jost,
    Roboto,
    Space_Grotesk,
} from 'next/font/google'

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

export const fraunces = Fraunces({
    subsets: ['latin'],
    weight: ['500', '600', '700'],
    display: 'swap',
    variable: '--font-fraunces',
})

export const spaceGrotesk = Space_Grotesk({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    display: 'swap',
    variable: '--font-space-grotesk',
})

export const ibmPlexMono = IBM_Plex_Mono({
    subsets: ['latin'],
    weight: ['400', '500', '600'],
    display: 'swap',
    variable: '--font-ibm-plex-mono',
})
