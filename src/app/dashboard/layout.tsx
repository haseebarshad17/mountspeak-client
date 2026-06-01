"use client";

import { useState } from "react";
import DashboardSidebar from "@/components/pages/dashboard/DashboardSidebar";

interface DashboardLayoutProps {
  readonly children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#fcfcfc] pt-[128px] pb-[50px]">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col px-4 sm:px-6 md:flex-row md:px-16">
        <div className="fixed left-4 top-4 z-40 md:hidden">
          <button
            type="button"
            aria-label="Open dashboard menu"
            onClick={() => setIsMobileSidebarOpen(true)}
            className="flex h-11 w-11 flex-col items-center justify-center gap-[5px] border border-[#d6dde1] bg-white"
          >
            <span className="h-[2px] w-6 bg-[#00292C]" />
            <span className="h-[2px] w-6 bg-[#00292C]" />
            <span className="h-[2px] w-6 bg-[#00292C]" />
          </button>
        </div>

        <div className="hidden md:block md:w-[264px] md:min-w-[264px] md:shrink-0">
          <DashboardSidebar />
        </div>
        <div className="flex-1">{children}</div>
      </div>

      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 md:hidden ${
          isMobileSidebarOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        <button
          type="button"
          aria-label="Close dashboard menu overlay"
          onClick={() => setIsMobileSidebarOpen(false)}
          className="absolute inset-0 bg-black/35"
        />
        <aside
          className={`absolute left-0 top-0 h-full w-[280px] bg-white p-4 shadow-xl transition-transform duration-300 ease-out ${
            isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="mb-3 flex justify-end">
            <button
              type="button"
              aria-label="Close dashboard menu"
              onClick={() => setIsMobileSidebarOpen(false)}
              className="text-2xl leading-none text-[#00292C]"
            >
              ×
            </button>
          </div>
          <DashboardSidebar />
        </aside>
      </div>
    </div>
  );
};

export default DashboardLayout;
