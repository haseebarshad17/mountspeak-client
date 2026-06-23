"use client"

import React from 'react'
import { useInternalPathname } from '@/hooks/useAgencyPreviewBase';
import Header from './header/header';
import TanstackQueryProvider from '@/lib/tanstack/query.provider';
import { Toaster } from 'sonner';
import MarketingFooter from '@/components/layout/marketing/MarketingFooter';
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
    const headerPage = page ?? DUMMY_HOMEPAGE_PAGE;

    return (
        <TanstackQueryProvider>
            {ShouldShowHeader ? <Header page={headerPage} /> : null}
            <div
                id='app-scroll-container'
                className='w-full h-dvh overflow-y-auto scrollbar-content'
            >
                {children}
                {ShouldShowFooter && <MarketingFooter />}
                <Toaster
                    position='bottom-right'
                    closeButton
                    toastOptions={{
                        classNames: {
                            toast:
                                'border border-white/20 bg-black/45 text-white backdrop-blur-lg shadow-xl shadow-black/30',
                            title: 'text-sm font-semibold',
                            description: 'text-xs text-white/80',
                            error: 'border-[#ffb4b4]/40',
                            success: 'border-[#86efac]/40',
                        },
                    }}
                />
            </div>
        </TanstackQueryProvider>
    )
}

export default LayoutWrapper
