import "@/assests/globals.css";
import "@/env/client";

import type { Metadata, Viewport } from "next";
import { buildPlatformMetadata } from "@/assests/meta";
import { jost, roboto } from "@/assests/fonts";
import { cn } from "@/lib/utils/clsxUtils";
import LayoutWrapper from "@/components/layout/marketing/LayoutWraper";
import HomepageBootstrap from "@/components/providers/HomepageBootstrap";
import HomepageThemeSync from "@/components/providers/HomepageThemeSync";
import StoreProvider from "@/store/StoreProvider";
import { getHomepageThemeCssVars } from "@/data/homepage";
import { getAgencyLayoutMetadata } from "@/lib/homepage/homepage-meta";
import { getRequestSiteUrl } from "@/lib/homepage/resolve-request-host";
import { fetchAgencyHomepage } from "@/services/homepage/homepage.server";

export async function generateMetadata(): Promise<Metadata> {
    const agencyHomepage = await fetchAgencyHomepage()

    if (agencyHomepage.isAgencySite && agencyHomepage.siteUrl) {
        try {
            return getAgencyLayoutMetadata(agencyHomepage)
        } catch {
            return buildPlatformMetadata(await getRequestSiteUrl())
        }
    }

    return buildPlatformMetadata(await getRequestSiteUrl())
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
    const agencyHomepage = await fetchAgencyHomepage()
    const bodyThemeStyle = getHomepageThemeCssVars(agencyHomepage.page.theme)

    return (
        <html
            lang="en"
            className={cn(jost.variable, roboto.variable)}
        >
            <body
                className={cn("font-body", roboto.variable)}
                style={bodyThemeStyle}
            >
                <StoreProvider initialHomepage={agencyHomepage}>
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
