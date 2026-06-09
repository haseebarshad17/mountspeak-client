"use client"

import React from 'react'
import { usePathname } from 'next/navigation';
import Header from './header/header';
import TanstackQueryProvider from '@/lib/tanstack/query.provider';
import { Toaster } from 'sonner';
import MarketingFooter from '@/components/layout/marketing/MarketingFooter';
import { useHomepagePageWithFallback } from '@/hooks/useHomepagePageWithFallback';

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
    const pathname = usePathname();
    const HeaderExcludeRoutes = [
        "/admin", "/admin/*", "/onboarding", "/onboarding/*", "/client", "/client/*",
        "/login", "/register", "/forgot-password", "/reset-password",
        "/booking", "/booking/*",
    ];

    const FooterExcludeRoutes = [
        "/admin", "/admin/*", "/onboarding", "/onboarding/*", "/client", "/client/*", "/dashboard", "/dashboard/*",
        "/bookings", "/bookings/*",
        "/login", "/register", "/forgot-password", "/reset-password",
        "/booking", "/booking/*",
    ];

    const ShouldShowHeader = !isExcludedRoute(pathname, HeaderExcludeRoutes);
    const ShouldShowFooter = !isExcludedRoute(pathname, FooterExcludeRoutes);

    return (
        <TanstackQueryProvider>
            {ShouldShowHeader && page ? <Header page={page} /> : null}
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
