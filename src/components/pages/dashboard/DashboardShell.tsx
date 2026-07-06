"use client";

import DashboardSidebar from "@/components/pages/dashboard/DashboardSidebar";
import { accountPageContentTopSpacingClassName } from "@/components/pages/dashboard/account-ui";
import { cn } from "@/lib/utils/clsxUtils";

interface DashboardShellProps {
  readonly children: React.ReactNode;
}

const DashboardShell = ({ children }: DashboardShellProps) => {
  return (
    <div className="account-pages min-h-screen bg-[#fcfcfc] pb-12 pt-[100px] sm:pb-16 sm:pt-[108px] md:pt-[116px] lg:pt-[124px]">
      <div className={cn("mx-auto flex w-full max-w-[1280px] flex-col px-4 sm:px-6 md:flex-row md:px-16", accountPageContentTopSpacingClassName)}>
        <div className="hidden md:block md:w-[264px] md:min-w-[264px] md:shrink-0">
          <DashboardSidebar />
        </div>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
};

export default DashboardShell;
