"use client"

import React from 'react'
import { usePathname } from 'next/navigation';
import Header from './header/header';
import Footer from './footer/footer';
import TanstackQueryProvider from '@/lib/tanstack/query.provider';
import { Toaster } from 'sonner';

interface LayoutWrapperProps {
    readonly children: React.ReactNode;
}


const LayoutWrapper = ({ children }: LayoutWrapperProps) => {
    const pathname = usePathname();
    const HeaderExcludeRoutes = [
        "/admin", "/admin/*", "/onboarding", "/onboarding/*", "/client", "/client/*",
        "/login", "/register", "/forgot-password", "/reset-password",
        "/booking", "/booking/*",
        "/bookings", "/bookings/*",
        "/detail", "/detail/*",
    ];

    const FooterExcludeRoutes = [
        "/admin", "/admin/*", "/onboarding", "/onboarding/*", "/client", "/client/*", "/dashboard", "/dashboard/*",
        "/login", "/register", "/forgot-password", "/reset-password",
        "/booking", "/booking/*",
        "/bookings", "/bookings/*",
        "/detail", "/detail/*",
    ];

    const ShouldShowHeader = HeaderExcludeRoutes.every(route => (!pathname.includes(route) || !pathname.startsWith(route)));
    const ShouldShowFooter = FooterExcludeRoutes.every(route => (!pathname.includes(route) || !pathname.startsWith(route)));


    return (
        <TanstackQueryProvider>
            <div
                id='app-scroll-container'
                className='w-full h-dvh overflow-y-auto scrollbar-content'
            >
                {ShouldShowHeader && <Header />}
                {children}
                {ShouldShowFooter && <Footer />}
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