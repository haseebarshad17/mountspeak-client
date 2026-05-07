import "@/assests/globals.css";
import "@/env/index";
import 'swiper/css'

import type { Metadata, Viewport } from "next";
import { defaultMeta } from "@/assests/meta";
import { notoSans, redHatText } from "@/assests/fonts";
import { cn } from "@/lib/utils/clsxUtils";
import LayoutWrapper from "@/components/layout/default/LayoutWraper";

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

export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <html
            lang="en"
            className={cn(
                notoSans.variable,
                redHatText.variable,
            )}
        >
            <body className={cn(notoSans.variable)}>
                <LayoutWrapper>{children}</LayoutWrapper>
            </body>
        </html>
    );
}
