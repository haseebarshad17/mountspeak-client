"use client";

import { AccountNavLinks } from "@/components/pages/dashboard/AccountNavLinks";
import DashboardSidebar from "@/components/pages/dashboard/DashboardSidebar";

interface DashboardShellProps {
  readonly children: React.ReactNode;
}

const DashboardShell = ({ children }: DashboardShellProps) => {
  return (
    <div className="account-pages min-h-screen bg-[#fcfcfc] pb-[50px] pt-[150px] sm:pt-[160px] md:pt-[168px] lg:pt-[176px]">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col px-4 sm:px-6 md:flex-row md:px-16">
        <div className="mb-6 md:hidden">
          <p className="mb-3 pl-2 text-[12px] font-semibold uppercase tracking-[0.6px] text-[#707979]">
            Account Settings
          </p>
          <AccountNavLinks variant="sidebar" />
        </div>
        <div className="hidden md:block md:w-[264px] md:min-w-[264px] md:shrink-0">
          <DashboardSidebar />
        </div>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
};

export default DashboardShell;
