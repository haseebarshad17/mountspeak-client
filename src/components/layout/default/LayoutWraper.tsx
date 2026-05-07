"use client"

import React from 'react'
// import Header from './header/header';
// import Footer from './footer/footer';
import { usePathname } from 'next/navigation';
import Header from './header/header';
import Footer from './footer/footer';

interface LayoutWrapperProps {
    readonly children: React.ReactNode;
}


const LayoutWrapper = ({ children }: LayoutWrapperProps) => {
    const pathname = usePathname();
    const HeaderExcludeRoutes = [
        "/admin", "/admin/*", "/onboarding", "/onboarding/*", "/client", "/client/*", "/dashboard", "/dashboard/*",
        "/login", "/register", "/forgot-password", "/reset-password",
    ];

    const FooterExcludeRoutes = [
        "/admin", "/admin/*", "/onboarding", "/onboarding/*", "/client", "/client/*", "/dashboard", "/dashboard/*",
        "/login", "/register", "/forgot-password", "/reset-password",
    ];

    const ShouldShowHeader = HeaderExcludeRoutes.every(route => (!pathname.includes(route) || !pathname.startsWith(route)));
    const ShouldShowFooter = FooterExcludeRoutes.every(route => (!pathname.includes(route) || !pathname.startsWith(route)));


    return (
        <div className='w-full h-dvh flex overflow-hidden'>
            <div
                id='app-scroll-container'
                className='w-full h-full overflow-y-auto scrollbar-content'
            >
                {ShouldShowHeader && <Header />}
                {children}
                {ShouldShowFooter && <Footer />}
            </div>
        </div>
    )
}

export default LayoutWrapper