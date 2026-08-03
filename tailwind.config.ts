import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
        './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['var(--font-roboto)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
                heading: ['var(--font-jost)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
                display: [
                    'var(--font-fraunces)',
                    'ui-serif',
                    'Georgia',
                    'serif',
                ],
                ui: [
                    'var(--font-space-grotesk)',
                    'ui-sans-serif',
                    'system-ui',
                    'sans-serif',
                ],
                mono: [
                    'var(--font-ibm-plex-mono)',
                    'ui-monospace',
                    'SFMono-Regular',
                    'monospace',
                ],
            },
            colors: {
                t3: {
                    navy: '#0E1B33',
                    panel: '#132445',
                    border: '#24365C',
                    gold: '#C9A15A',
                    cream: '#F7F3E8',
                    muted: '#8FA0BE',
                    soft: '#93A3C2',
                    dim: '#5A6F94',
                    hero: '#0A2F53',
                    warm: '#E89C5D',
                },
            },
            screens: {
                xs: '480px',
                sm: '640px',
                md: '768px',
                lg: '1024px',
                xl: '1170px',
                '2xl': '1280px',
            },
            borderRadius: {
                sm: '4px',
                md: '8px',
                lg: '12px',
                xl: '16px',
                '2xl': '24px',
                full: '9999px',
            },
            maxWidth: {
                t3: '1180px',
            },
        },
    },
    plugins: [],
}

export default config
