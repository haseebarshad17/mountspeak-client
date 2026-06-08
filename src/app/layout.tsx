import "@/assests/globals.css";
import "@/env/client";
import 'swiper/css'

import type { Metadata, Viewport } from "next";
import { defaultMeta } from "@/assests/meta";
import { hankenGrotesk, jetBrainsMono, jost, manrope, notoSans, notoSerif, plusJakartaSans, redHatText, roboto } from "@/assests/fonts";
import { cn } from "@/lib/utils/clsxUtils";
import LayoutWrapper from "@/components/layout/marketing/LayoutWraper";
import HomepageBootstrap from "@/components/providers/HomepageBootstrap";
import HomepageThemeSync from "@/components/providers/HomepageThemeSync";
import StoreProvider from "@/store/StoreProvider";
import { getHomepageThemeCssVars } from "@/data/homepage";
import { fetchAgencyHomepage } from "@/services/homepage/homepage.server";

export const metadata: Metadata = defaultMeta;

export const viewport: Viewport = {
    themeColor: "#003B95",
    userScalable: false,
    initialScale: 1,
    maximumScale: 1,
    minimumScale: 1,
}

interface RootLayoutProps {
    readonly children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
    const agencyHomepage = await fetchAgencyHomepage()
    const bodyThemeStyle = getHomepageThemeCssVars(agencyHomepage.page.theme)

    return (
        <html
            lang="en"
            className={cn(
                notoSans.variable,
                redHatText.variable,
                jost.variable,
                roboto.variable,
                hankenGrotesk.variable,
                plusJakartaSans.variable,
                jetBrainsMono.variable,
                notoSerif.variable,
                manrope.variable,
            )}
        >
            <body
                className={cn(notoSans.variable)}
                style={bodyThemeStyle}
            >
                <StoreProvider>
                    <HomepageBootstrap />
                    <HomepageThemeSync />
                    <LayoutWrapper>
                        {children}
                    </LayoutWrapper>
                </StoreProvider>
            </body>
        </html>
    );
}
