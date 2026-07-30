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
        },
    },
    plugins: [],
}

export default config
