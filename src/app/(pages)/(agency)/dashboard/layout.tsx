"use client";

import DashboardLayoutWrapper from "@/components/layout/dashboard/DashboardLayoutWrapper";


interface DashboardLayoutProps {
    readonly children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    return <DashboardLayoutWrapper>{children}</DashboardLayoutWrapper>
}
