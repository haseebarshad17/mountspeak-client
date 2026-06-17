import "@/assests/globals.css";
import "@/env/client";
import 'swiper/css'

import type { Metadata, Viewport } from "next";
import { defaultMeta } from "@/assests/meta";
import { jost, roboto } from "@/assests/fonts";
import { cn } from "@/lib/utils/clsxUtils";
import LayoutWrapper from "@/components/layout/marketing/LayoutWraper";
import HomepageBootstrap from "@/components/providers/HomepageBootstrap";
import HomepageThemeSync from "@/components/providers/HomepageThemeSync";
import StoreProvider from "@/store/StoreProvider";
import { getHomepageThemeCssVars } from "@/data/homepage";
import { DUMMY_HOMEPAGE_PAGE } from "@/lib/homepage/default-homepage";
import { getAgencyLayoutMetadata } from "@/lib/homepage/homepage-meta";
import { fetchAgencyHomepage } from "@/services/homepage/homepage.server";

export async function generateMetadata(): Promise<Metadata> {
    const agencyHomepage = await fetchAgencyHomepage()

    if (agencyHomepage.isAgencySite && agencyHomepage.siteUrl) {
        try {
            return getAgencyLayoutMetadata(agencyHomepage)
        } catch {
            return defaultMeta
        }
    }

    return defaultMeta
}

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
    const bodyThemeStyle = getHomepageThemeCssVars(DUMMY_HOMEPAGE_PAGE.theme)

    return (
        <html
            lang="en"
            className={cn(jost.variable, roboto.variable)}
        >
            <body
                className={cn("font-body", roboto.variable)}
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
