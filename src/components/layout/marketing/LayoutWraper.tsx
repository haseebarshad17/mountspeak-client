"use client"

import React from 'react'
import { useInternalPathname } from '@/hooks/useAgencyPreviewBase';
import Header from './header/header';
import TanstackQueryProvider from '@/lib/tanstack/query.provider';
import { AppToaster } from '@/components/ui/app-toaster';
import MarketingFooter from '@/components/layout/marketing/MarketingFooter';
import FloatingSocialIcons from '@/components/layout/marketing/FloatingSocialIcons';
import { useHomepagePageWithFallback } from '@/hooks/useHomepagePageWithFallback';
import { DUMMY_HOMEPAGE_PAGE } from '@/lib/homepage/default-homepage';

interface LayoutWrapperProps {
    readonly children: React.ReactNode;
}

function matchesExcludedRoute(pathname: string, pattern: string): boolean {
    if (pattern.endsWith('/*')) {
        const base = pattern.slice(0, -2)
        return pathname === base || pathname.startsWith(`${base}/`)
    }

    return pathname === pattern
}

function isExcludedRoute(pathname: string, patterns: string[]): boolean {
    return patterns.some((pattern) => matchesExcludedRoute(pathname, pattern))
}

const LayoutWrapper = ({ children }: LayoutWrapperProps) => {
    const page = useHomepagePageWithFallback();
    const pathname = useInternalPathname();
    const HeaderExcludeRoutes = [
        "/admin", "/admin/*", "/onboarding", "/onboarding/*", "/client", "/client/*",
        "/login", "/register", "/forgot-password", "/reset-password", "/verify-email",
        "/booking", "/booking/*",
    ];

    const FooterExcludeRoutes = [
        "/admin", "/admin/*", "/onboarding", "/onboarding/*", "/client", "/client/*",
        "/login", "/register", "/forgot-password", "/reset-password", "/verify-email",
        "/booking", "/booking/*",
    ];

    const ShouldShowHeader = !isExcludedRoute(pathname, HeaderExcludeRoutes);
    const ShouldShowFooter = !isExcludedRoute(pathname, FooterExcludeRoutes);
    const isBookingRoute = isExcludedRoute(pathname, ["/booking", "/booking/*"]);
    const headerPage = page ?? DUMMY_HOMEPAGE_PAGE;

    const toaster = <AppToaster />;

    return (
        <TanstackQueryProvider>
            {ShouldShowHeader ? <Header page={headerPage} /> : null}
            {isBookingRoute ? (
                <div className='w-full min-h-dvh'>
                    {children}
                    {toaster}
                </div>
            ) : (
                <div
                    id='app-scroll-container'
                    className='w-full h-dvh min-h-0 overflow-x-hidden overflow-y-auto scrollbar-content'
                >
                    {children}
                    {ShouldShowFooter && <MarketingFooter />}
                    {ShouldShowFooter ? <FloatingSocialIcons /> : null}
                    {toaster}
                </div>
            )}
        </TanstackQueryProvider>
    )
}

export default LayoutWrapper
