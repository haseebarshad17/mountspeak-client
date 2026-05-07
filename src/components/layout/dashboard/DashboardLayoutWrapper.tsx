"use client";

import { ReactNode, useState } from "react";
import { cn } from "@/lib/utils/clsxUtils";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { usePathname } from "next/navigation";
import DashboardHeader from "./header/dashboard-header";
import DashboardSidebar from "./sidebar/dashboard-sidebar";
import { getDashboardPageTitle } from "./content";

interface LayoutWrapperProps {
    readonly children: ReactNode;
}


const DashboardLayoutWrapper = ({ children }: LayoutWrapperProps) => {
    const [sidebarExpanded, setSidebarExpanded] = useState(false);
    const [isLocked, setIsLocked] = useState(false);
    const isMobile = useBreakpoint("lg", "down");
    const pathname = usePathname();
    const pageTitle = getDashboardPageTitle(pathname);

    return (
        <div className="bg-neutral-50 w-full h-full flex overflow-hidden">
            <DashboardSidebar
                isMobile={isMobile}
                isLocked={isLocked}
                setIsLocked={setIsLocked}
                sidebarExpanded={sidebarExpanded}
                setSidebarExpanded={setSidebarExpanded}
            />

            <div className="flex flex-col flex-1 min-h-0">
                <div
                    className={cn(
                        "flex flex-col flex-1 min-h-0 ease duration-300",
                        isMobile ? "pl-0" : !isLocked ? "pl-[76px]" : "2xl:pl-[280px] pl-[250px]",
                    )}
                >
                    <DashboardHeader
                        title={pageTitle}
                        subtitle="Manage your tours and bookings"
                        onToggleSidebar={() => {
                            if (isMobile) setSidebarExpanded((prev) => !prev);
                        }}
                    />

                    <div
                        className="flex flex-col flex-1 min-h-0 overflow-y-auto scrollbar-content"
                        data-page-title={pageTitle}
                    >
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardLayoutWrapper;