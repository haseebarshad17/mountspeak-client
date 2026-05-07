"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils/clsxUtils";
import TentaLogo from "@/components/generic/Logo";
import { DASHBOARD_NAV_SECTIONS } from "../content";

interface DashboardSidebarProps {
    readonly isLocked: boolean;
    readonly sidebarExpanded: boolean;
    readonly setSidebarExpanded: (v: boolean) => void;
    readonly setIsLocked: (v: boolean) => void;
    readonly isMobile: boolean;
}

const DashboardSidebar = ({
    sidebarExpanded,
    setSidebarExpanded,
    isLocked,
    setIsLocked,
    isMobile,
}: DashboardSidebarProps) => {
    const pathname = usePathname();
    const [showScrollbar, setShowScrollbar] = useState(false);

    useEffect(() => {
        if (sidebarExpanded) {
            const timer = setTimeout(() => {
                setShowScrollbar(true);
            }, 180);
            return () => clearTimeout(timer);
        }
        setShowScrollbar(false);
        return undefined;
    }, [sidebarExpanded]);

    useEffect(() => {
        if (isMobile) {
            setSidebarExpanded(false);
        } else {
            setSidebarExpanded(true);
            setIsLocked(true);
        }
    }, [isMobile, setIsLocked, setSidebarExpanded]);

    return (
        <>
            {isMobile && (
                <div
                    className={cn(
                        "fixed inset-0 z-50 transition-opacity duration-300 ease-in-out bg-black/30 backdrop-blur-[2px]",
                        sidebarExpanded ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
                    )}
                    onClick={() => setSidebarExpanded(false)}
                    aria-hidden={!sidebarExpanded}
                />
            )}

            <aside
                onMouseEnter={() => {
                    if (!isLocked && !isMobile) setSidebarExpanded(true);
                }}
                onMouseLeave={() => {
                    if (!isLocked && !isMobile) setSidebarExpanded(false);
                }}
                className={cn(
                    "bg-white border-r border-layout-separator flex flex-col fixed left-0 top-0 h-full min-h-dvh z-[51]",
                    isMobile
                        ? "w-[280px] transition-transform duration-300 ease-in-out will-change-transform"
                        : "transition-[width] duration-300 ease-in-out will-change-[width]",
                    isMobile
                        ? sidebarExpanded
                            ? "translate-x-0"
                            : "-translate-x-[calc(100%+20px)]"
                        : sidebarExpanded
                            ? "2xl:w-[280px] w-[250px]"
                            : "w-[76px]",
                )}
            >
                <header className="border-b border-layout-separator flex items-center px-4 h-[73px] w-full justify-center relative">
                    <TentaLogo
                        href="/dashboard"
                        className="flex w-full items-center gap-3 overflow-hidden"
                        markClassName="h-10 w-10 shrink-0 rounded-lg"
                        textClassName="truncate font-heading text-xl tracking-tight text-neutral-900"
                    />

                    <button
                        onClick={() => {
                            if (!isLocked) {
                                setIsLocked(true);
                                setSidebarExpanded(true);
                            } else {
                                setIsLocked(false);
                                setSidebarExpanded(false);
                            }
                        }}
                        className={cn(
                            "absolute right-0 bottom-0 w-7 h-7 rounded-md border z-[60] shadow-md cursor-pointer translate-x-1/2 translate-y-1/2",
                            "flex items-center justify-center transition-all duration-200",
                            "bg-primary-50 border-primary-200 hover:bg-primary-100 hover:border-primary-300 hidden lg:flex",
                        )}
                        aria-label={sidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
                    >
                        <ChevronLeft
                            className={cn(
                                "h-4 w-4 text-primary-700 transition-transform duration-300 rotate-180",
                                isLocked && !isMobile && "rotate-0",
                                isMobile && sidebarExpanded && "rotate-0",
                            )}
                        />
                    </button>
                </header>

                <main className="w-full overflow-hidden flex flex-col flex-1">
                    <nav className="flex-1 overflow-hidden flex py-4">
                        <div
                            className={cn(
                                "overflow-y-auto flex-1 pl-3 pr-0",
                                sidebarExpanded && showScrollbar ? "scrollbar-thin" : "scrollbar-hide",
                            )}
                        >
                            {DASHBOARD_NAV_SECTIONS.map((section, idx) => (
                                <div
                                    key={section.title}
                                    className={cn(idx !== DASHBOARD_NAV_SECTIONS.length - 1 && "mb-8")}
                                >
                                    <div
                                        className={cn(
                                            "overflow-hidden whitespace-nowrap mb-3 px-3 transition-opacity duration-300",
                                            sidebarExpanded ? "opacity-100" : "opacity-0",
                                        )}
                                    >
                                        <h3 className="text-xs font-semibold font-heading text-primary-500 uppercase tracking-wider">
                                            {section.title}
                                        </h3>
                                    </div>

                                    <div className="space-y-0.5 pr-3">
                                        {section.items.map((item) => {
                                            const Icon = item.icon;
                                            const isActive =
                                                item.href === "/dashboard"
                                                    ? pathname === item.href
                                                    : pathname.startsWith(item.href);

                                            return (
                                                <Link
                                                    key={item.href}
                                                    href={item.href}
                                                    className={cn(
                                                        "w-full flex items-center rounded-md transition-all duration-150 group relative truncate",
                                                        "px-[14px] py-3 font-medium border",
                                                        isActive
                                                            ? sidebarExpanded
                                                                ? "bg-primary-50 text-primary-800 justify-start border-primary-200 shadow-sm"
                                                                : "bg-primary-100 text-primary-700 border-primary-200"
                                                            : "text-neutral-700 border-transparent hover:bg-primary-50 hover:text-primary-700 hover:border-primary-100",
                                                    )}
                                                    onClick={() => {
                                                        if (isMobile) setSidebarExpanded(false);
                                                    }}
                                                >
                                                    <Icon
                                                        size={20}
                                                        className={cn(
                                                            "flex-shrink-0",
                                                            isActive
                                                                ? "text-primary-600"
                                                                : "text-neutral-500 group-hover:text-primary-600",
                                                        )}
                                                    />
                                                    <span
                                                        className={cn(
                                                            "whitespace-nowrap text-sm overflow-hidden truncate transition-all duration-200 pl-3",
                                                        )}
                                                    >
                                                        {item.label}
                                                    </span>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </nav>

                    <div
                        className={cn(
                            "flex-shrink-0 h-[120px]",
                            sidebarExpanded ? "p-4" : "px-2 py-4",
                        )}
                    >
                        {sidebarExpanded ? (
                            <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-md border border-primary-200 w-full h-full p-3 flex flex-col justify-center overflow-hidden">
                                <div className="flex items-center justify-between gap-2">
                                    <span className="inline-flex rounded-md bg-white/90 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-primary-700 whitespace-nowrap">
                                        Agency Workspace
                                    </span>
                                </div>
                                <p className="mt-2 text-[11px] text-primary-800 leading-relaxed font-medium whitespace-nowrap truncate">
                                    Manage tours, bookings, and customer experiences
                                </p>
                                <p className="text-[11px] text-primary-700 mt-1 font-semibold whitespace-nowrap truncate">
                                    Tenta Agency Portal
                                </p>
                            </div>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <div className="flex flex-col items-center gap-1 opacity-70">
                                    <div className="w-1 h-1 rounded-full bg-primary-500" />
                                    <div className="w-1 h-1 rounded-full bg-primary-400" />
                                    <div className="w-1 h-1 rounded-full bg-primary-300" />
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </aside>
        </>
    );
};

export default DashboardSidebar;
