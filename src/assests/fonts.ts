import {
    // Agdasima, Noto_Sans,
    // Red_Hat_Text,
    Hanken_Grotesk,
    JetBrains_Mono,
    Jost,
    Karla,
    Manrope,
    Montserrat,
    Noto_Serif,
    Plus_Jakarta_Sans,
    Roboto,
} from "next/font/google";


// Heading Font
export const redHatText = Montserrat({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700", "800", "900"],
    display: "swap",
    variable: "--font-heading",
});
// export const redHatText = Agdasima({
//     subsets: ["latin"],
//     weight: ["400", "700"],
//     display: "swap",
//     variable: "--font-heading",
// });
// export const redHatText = Red_Hat_Text({
//     subsets: ["latin"],
//     weight: ["300", "400", "500", "600", "700"],
//     display: "swap",
//     variable: "--font-heading",
// });


// Body Font
export const notoSans = Karla({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800"],
    display: "swap",
    variable: "--font-noto",
});
// export const notoSans = Roboto({
//     subsets: ["latin"],
//     weight: ["300", "400", "500", "700"],
//     display: "swap",
//     variable: "--font-noto",
// });
// export const notoSans = Noto_Sans({
//     subsets: ["latin", "latin-ext", "devanagari", "cyrillic", "greek", "vietnamese"],
//     weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
//     display: "swap",
//     variable: "--font-noto",
// });

export const jost = Jost({
    subsets: ["latin"],
    weight: ["500"],
    display: "swap",
    variable: "--font-jost",
});

export const roboto = Roboto({
    subsets: ["latin"],
    weight: ["400"],
    display: "swap",
    variable: "--font-roboto",
});

export const hankenGrotesk = Hanken_Grotesk({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800"],
    display: "swap",
    variable: "--font-hanken-grotesk",
});

export const plusJakartaSans = Plus_Jakarta_Sans({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800"],
    display: "swap",
    variable: "--font-plus-jakarta-sans",
});

export const jetBrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800"],
    display: "swap",
    variable: "--font-jetbrains-mono",
});

export const notoSerif = Noto_Serif({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    display: "swap",
    variable: "--font-noto-serif",
});

export const manrope = Manrope({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800"],
    display: "swap",
    variable: "--font-manrope",
});

