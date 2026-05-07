"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronDown, LogOut, Plus, User } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils/clsxUtils";
import MenuIcon from "@/assests/svg/MenuIcon";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
    readonly title: string;
    readonly subtitle: string;
    readonly onToggleSidebar?: () => void;
    readonly className?: string;
}

const DashboardHeader = ({ title, subtitle, onToggleSidebar, className }: DashboardHeaderProps) => {
    const router = useRouter();
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header
            className={cn(
                "bg-white border-b border-layout-separator h-[73px] flex items-center px-3 sm:px-4 md:px-6",
                className,
            )}
        >
            <div className="flex w-full items-center justify-between gap-2 sm:gap-3 md:gap-4">
                <div className="min-w-0 flex-1 pr-2 sm:pr-4">
                    <h4 className="flex items-center gap-2 text-lg sm:text-xl text-primary-900 truncate">
                        {title}
                    </h4>
                    <p className="text-[11px] sm:text-xs font-medium text-gray-700 truncate min-w-0">
                        {subtitle}
                    </p>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                    <div className="hidden sm:block">
                        <Button
                            shouldScale
                            href="/dashboard/tours/create"
                            variant="default"
                            size="sm"
                            className="rounded-md px-3 md:px-5 text-xs"
                        >
                            <Plus size={14} />
                            Create Tour
                        </Button>
                    </div>

                    <Popover open={menuOpen} onOpenChange={setMenuOpen}>
                        <PopoverTrigger asChild>
                            <button
                                type="button"
                                className="inline-flex items-center gap-1.5"
                                aria-label="Open profile menu"
                            >
                                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700 ring-2 ring-white">
                                    AP
                                </span>
                                <ChevronDown
                                    size={16}
                                    className={cn(
                                        "text-neutral-500 transition-transform duration-200 hidden md:block",
                                        menuOpen && "rotate-180",
                                    )}
                                />
                            </button>
                        </PopoverTrigger>

                        <PopoverContent
                            align="end"
                            className={cn(
                                "w-48 rounded-md border border-primary-100 bg-white p-1.5 shadow-lg",
                                "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-top-2",
                                "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:slide-out-to-top-2",
                            )}
                        >
                            <Link
                                href="/dashboard/profile"
                                onClick={() => setMenuOpen(false)}
                                className={cn(
                                    "flex items-center gap-2 rounded-md border border-transparent px-3 py-2 text-sm font-medium text-neutral-700",
                                    "transition-colors duration-200",
                                    "hover:bg-primary-50 hover:text-primary-700 hover:border-primary-200",
                                )}
                            >
                                <User size={15} />
                                Profile
                            </Link>
                            <button
                                type="button"
                                onClick={() => {
                                    setMenuOpen(false);
                                    router.push("/sign-in");
                                }}
                                className={cn(
                                    "flex w-full items-center gap-2 rounded-md border border-transparent px-3 py-2 text-sm font-medium text-neutral-700",
                                    "transition-colors duration-200",
                                    "hover:bg-primary-50 hover:text-primary-700 hover:border-primary-200",
                                )}
                            >
                                <LogOut size={15} />
                                Logout
                            </button>
                        </PopoverContent>
                    </Popover>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onToggleSidebar}
                        shouldScale
                        className={cn(
                            "lg:hidden flex-shrink-0",
                            "h-10 w-10 p-0",
                            "hover:bg-gray-100/80 active:bg-gray-200/60",
                            "text-gray-600 hover:text-gray-900",
                            "rounded-lg",
                            "transition-colors duration-150",
                            "!focus-visible:ring-0 !focus-visible:ring-offset-0 focus-visible:outline-none",
                            "focus:outline-none !ring-0 !ring-offset-0",
                            "active:ring-0 active:ring-offset-0",
                        )}
                    >
                        <MenuIcon />
                    </Button>
                </div>
            </div>
        </header>
    );
};

export default DashboardHeader;
