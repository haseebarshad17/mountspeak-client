import {
    BarChart3,
    Calendar,
    LayoutDashboard,
    MapPin,
    Package,
    Palette,
    Settings,
    Users,
} from "lucide-react";
import { LucideIcon } from "lucide-react";

export interface DashboardNavItem {
    readonly label: string;
    readonly href: string;
    readonly icon: LucideIcon;
    readonly description: string;
}

export interface DashboardNavSection {
    readonly title: string;
    readonly items: readonly DashboardNavItem[];
}

export const DASHBOARD_NAV_SECTIONS: readonly DashboardNavSection[] = [
    {
        title: "Main",
        items: [
            {
                label: "Overview",
                href: "/dashboard",
                icon: LayoutDashboard,
                description: "Agency-level KPIs and performance overview",
            },
        ],
    },
    {
        title: "Operations",
        items: [
            {
                label: "Tours",
                href: "/dashboard/tours",
                icon: MapPin,
                description: "Manage tours, packages, and availability",
            },
            {
                label: "Bookings",
                href: "/dashboard/bookings",
                icon: Calendar,
                description: "Review and track booking statuses",
            },
            {
                label: "Customers",
                href: "/dashboard/customers",
                icon: Users,
                description: "View customer profiles and history",
            },
            {
                label: "Site Builder",
                href: "/dashboard/builder",
                icon: Package,
                description: "Customize website pages and sections",
            },
            {
                label: "Themes",
                href: "/dashboard/themes",
                icon: Palette,
                description: "Manage branding and visual styles",
            },
            {
                label: "Analytics",
                href: "/dashboard/analytics",
                icon: BarChart3,
                description: "Inspect revenue and engagement trends",
            },
        ],
    },
    {
        title: "System",
        items: [
            {
                label: "Settings",
                href: "/dashboard/settings",
                icon: Settings,
                description: "Agency account and preferences",
            },
        ],
    },
];

export const DASHBOARD_NAV_ITEMS = DASHBOARD_NAV_SECTIONS.flatMap((section) => section.items);

export const getDashboardPageTitle = (pathname: string) => {
    const matched = DASHBOARD_NAV_ITEMS.find((item) => {
        if (item.href === "/dashboard") return pathname === item.href;
        return pathname.startsWith(item.href);
    });

    return matched?.label ?? "Overview";
};
