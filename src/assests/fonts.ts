import {
    // Agdasima, Noto_Sans,
    // Roboto,
    // Red_Hat_Text,
    Montserrat,
    Karla
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

