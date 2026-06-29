"use client";

import { AccountNavLinks } from "@/components/pages/dashboard/AccountNavLinks";

interface DashboardSidebarProps {
  onNavigate?: () => void;
}

const DashboardSidebar = ({ onNavigate }: DashboardSidebarProps) => {
  return (
    <aside className="w-full md:w-[264px] md:min-w-[264px] md:max-w-[264px]">
      <div>
        <p className="pl-2 text-[12px] font-semibold uppercase tracking-[0.6px] text-[#707979]">
          Account Settings
        </p>
        <div className="mt-4">
          <AccountNavLinks onNavigate={onNavigate} variant="sidebar" />
        </div>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
