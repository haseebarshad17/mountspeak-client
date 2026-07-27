import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            // Font Family  
            fontFamily: {
                heading: ["var(--font-jost)", "ui-sans-serif", "system-ui", "sans-serif"],
                body: ["var(--font-roboto)", "ui-sans-serif", "system-ui", "sans-serif"],
                jost: ["var(--font-jost)", "ui-sans-serif", "system-ui", "sans-serif"],
                roboto: ["var(--font-roboto)", "ui-sans-serif", "system-ui", "sans-serif"],
            },

            // Screens
            screens: {
                xs: "480px",
                sm: "640px",
                md: "768px",
                lg: "1024px",
                xl: "1170px",
                "2xl": "1280px",
            },

            // Colors
            colors: {
                "layout-separator": "#E5E7EB",
                "agency-header": "#0A3248",
                "agency-primary-forground": "#FFF2DD",

                primary: {
                    50: "rgb(var(--color-primary-50) / <alpha-value>)",
                    100: "rgb(var(--color-primary-100) / <alpha-value>)",
                    200: "rgb(var(--color-primary-200) / <alpha-value>)",
                    300: "rgb(var(--color-primary-300) / <alpha-value>)",
                    400: "rgb(var(--color-primary-400) / <alpha-value>)",
                    500: "rgb(var(--color-primary-500) / <alpha-value>)",
                    600: "rgb(var(--color-primary-600) / <alpha-value>)",
                    700: "rgb(var(--color-primary-700) / <alpha-value>)",
                    800: "rgb(var(--color-primary-800) / <alpha-value>)",
                    900: "rgb(var(--color-primary-900) / <alpha-value>)",
                    DEFAULT: "rgb(var(--color-primary-500) / <alpha-value>)",
                },

                neutral: {
                    50: "rgb(var(--color-neutral-50) / <alpha-value>)",
                    100: "rgb(var(--color-neutral-100) / <alpha-value>)",
                    200: "rgb(var(--color-neutral-200) / <alpha-value>)",
                    300: "rgb(var(--color-neutral-300) / <alpha-value>)",
                    400: "rgb(var(--color-neutral-400) / <alpha-value>)",
                    500: "rgb(var(--color-neutral-500) / <alpha-value>)",
                    600: "rgb(var(--color-neutral-600) / <alpha-value>)",
                    700: "rgb(var(--color-neutral-700) / <alpha-value>)",
                    800: "rgb(var(--color-neutral-800) / <alpha-value>)",
                    900: "rgb(var(--color-neutral-900) / <alpha-value>)",
                    DEFAULT: "rgb(var(--color-neutral-500) / <alpha-value>)",
                },

                emerald: {
                    50: "oklch(var(--color-emerald-50) / <alpha-value>)",
                    100: "oklch(var(--color-emerald-100) / <alpha-value>)",
                    200: "oklch(var(--color-emerald-200) / <alpha-value>)",
                    300: "oklch(var(--color-emerald-300) / <alpha-value>)",
                    400: "oklch(var(--color-emerald-400) / <alpha-value>)",
                    500: "oklch(var(--color-emerald-500) / <alpha-value>)",
                    600: "oklch(var(--color-emerald-600) / <alpha-value>)",
                    700: "oklch(var(--color-emerald-700) / <alpha-value>)",
                    800: "oklch(var(--color-emerald-800) / <alpha-value>)",
                    900: "oklch(var(--color-emerald-900) / <alpha-value>)",
                    DEFAULT: "oklch(var(--color-emerald-500) / <alpha-value>)",
                },
                red: {
                    50: "oklch(var(--color-red-50) / <alpha-value>)",
                    100: "oklch(var(--color-red-100) / <alpha-value>)",
                    200: "oklch(var(--color-red-200) / <alpha-value>)",
                    300: "oklch(var(--color-red-300) / <alpha-value>)",
                    400: "oklch(var(--color-red-400) / <alpha-value>)",
                    500: "oklch(var(--color-red-500) / <alpha-value>)",
                    600: "oklch(var(--color-red-600) / <alpha-value>)",
                    700: "oklch(var(--color-red-700) / <alpha-value>)",
                    800: "oklch(var(--color-red-800) / <alpha-value>)",
                    900: "oklch(var(--color-red-900) / <alpha-value>)",
                    DEFAULT: "oklch(var(--color-red-500) / <alpha-value>)",
                },
                amber: {
                    50: "oklch(var(--color-amber-50) / <alpha-value>)",
                    100: "oklch(var(--color-amber-100) / <alpha-value>)",
                    200: "oklch(var(--color-amber-200) / <alpha-value>)",
                    300: "oklch(var(--color-amber-300) / <alpha-value>)",
                    400: "oklch(var(--color-amber-400) / <alpha-value>)",
                    500: "oklch(var(--color-amber-500) / <alpha-value>)",
                    600: "oklch(var(--color-amber-600) / <alpha-value>)",
                    700: "oklch(var(--color-amber-700) / <alpha-value>)",
                    800: "oklch(var(--color-amber-800) / <alpha-value>)",
                    900: "oklch(var(--color-amber-900) / <alpha-value>)",
                    DEFAULT: "oklch(var(--color-amber-500) / <alpha-value>)",
                },
                purple: {
                    50: "oklch(var(--color-purple-50) / <alpha-value>)",
                    100: "oklch(var(--color-purple-100) / <alpha-value>)",
                    200: "oklch(var(--color-purple-200) / <alpha-value>)",
                    300: "oklch(var(--color-purple-300) / <alpha-value>)",
                    400: "oklch(var(--color-purple-400) / <alpha-value>)",
                    500: "oklch(var(--color-purple-500) / <alpha-value>)",
                    600: "oklch(var(--color-purple-600) / <alpha-value>)",
                    700: "oklch(var(--color-purple-700) / <alpha-value>)",
                    800: "oklch(var(--color-purple-800) / <alpha-value>)",
                    900: "oklch(var(--color-purple-900) / <alpha-value>)",
                    DEFAULT: "oklch(var(--color-purple-500) / <alpha-value>)",
                },
                blue: {
                    50: "oklch(var(--color-blue-50) / <alpha-value>)",
                    100: "oklch(var(--color-blue-100) / <alpha-value>)",
                    200: "oklch(var(--color-blue-200) / <alpha-value>)",
                    300: "oklch(var(--color-blue-300) / <alpha-value>)",
                    400: "oklch(var(--color-blue-400) / <alpha-value>)",
                    500: "oklch(var(--color-blue-500) / <alpha-value>)",
                    600: "oklch(var(--color-blue-600) / <alpha-value>)",
                    700: "oklch(var(--color-blue-700) / <alpha-value>)",
                    800: "oklch(var(--color-blue-800) / <alpha-value>)",
                    900: "oklch(var(--color-blue-900) / <alpha-value>)",
                    DEFAULT: "oklch(var(--color-blue-500) / <alpha-value>)",
                },
            },

            borderRadius: {
                sm: "4px",
                md: "8px",
                lg: "12px",
                xl: "16px",
                full: "9999px",
            },
        },
    },
    plugins: [],
};
export default config;