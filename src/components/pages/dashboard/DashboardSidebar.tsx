"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookMarked, LogOut, UserRound } from "lucide-react";

interface DashboardSidebarProps {
  onNavigate?: () => void;
}

const DashboardSidebar = ({ onNavigate }: DashboardSidebarProps) => {
  const pathname = usePathname();
  const isProfileActive = pathname.startsWith("/dashboard");
  const isBookingsActive = pathname.startsWith("/bookings");

  return (
    <aside className="w-full md:w-[264px] md:min-w-[264px] md:max-w-[264px]">
      <div>
        <p
          className="text-[12px] font-semibold uppercase tracking-[0.6px] pl-2 text-[#707979]"
          style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
        >
          Account Settings
        </p>

        <nav className="mt-4 space-y-2">
          <Link
            href="/dashboard"
            onClick={onNavigate}
            className={`flex min-h-[48px] max-w-[264px] w-full items-center gap-3 px-4 text-left text-base transition ${
              isProfileActive
                ? "border border-[#e4ebee] border-l-4 border-l-[#00292C] bg-[#0640451A] text-[#1a1c1e]"
                : "border border-transparent text-[#2f3b45] hover:bg-[#0640451A]"
            }`}
          >
            <UserRound className="h-4 w-4 text-[#4b5964]" />
            <span
              className="text-base font-normal"
              style={{ fontFamily: "var(--font-plus-jakarta-sans), sans-serif" }}
            >
              Profile
            </span>
          </Link>

          <Link
            href="/bookings"
            onClick={onNavigate}
            className={`flex h-12 w-full max-w-[264px] items-center gap-3 px-4 text-left transition ${
              isBookingsActive
                ? "border border-[#e4ebee] border-l-4 border-l-[#00292C] bg-[#0640451A] text-[#1a1c1e]"
                : "border border-transparent text-[#2f3b45] hover:bg-[#0640451A]"
            }`}
          >
            <BookMarked className="h-4 w-4 text-[#4b5964]" />
            <span
              className="text-base font-medium"
              style={{ fontFamily: "var(--font-plus-jakarta-sans), sans-serif" }}
            >
              Bookings
            </span>
          </Link>
        </nav>

        <button
          type="button"
          className="mt-12 flex items-center min-h-[88px] gap-3 px-4 text-[#b71c1c] transition hover:text-[#8e1414]"
        >
          <LogOut className="h-4 w-4" />
          <span
            className="text-base font-medium"
            style={{ fontFamily: "var(--font-plus-jakarta-sans), sans-serif" }}
          >
            Sign Out
          </span>
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
