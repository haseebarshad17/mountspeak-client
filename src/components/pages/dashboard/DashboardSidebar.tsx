"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookMarked, LogOut, UserRound } from "lucide-react";

interface DashboardSidebarProps {
  onNavigate?: () => void;
}

const navLinkClassName = (isActive: boolean) =>
  [
    "!flex min-h-12 w-full max-w-[264px] items-center gap-3 border border-l-4 px-4 text-left transition",
    isActive
      ? "border-[#e4ebee] border-l-[#00292C] bg-[#0640451A] text-[#1a1c1e]"
      : "border-transparent border-l-transparent text-[#2f3b45] hover:bg-[#0640451A]",
  ].join(" ");

const DashboardSidebar = ({ onNavigate }: DashboardSidebarProps) => {
  const pathname = usePathname();
  const isProfileActive = pathname.startsWith("/dashboard");
  const isBookingsActive = pathname.startsWith("/bookings");

  return (
    <aside className="w-full md:w-[264px] md:min-w-[264px] md:max-w-[264px]">
      <div>
        <p
          className="text-[12px] font-semibold uppercase tracking-[0.6px] pl-2 text-[#707979]"
          style={{ fontFamily: "var(--hp-font-body)" }}
        >
          Account Settings
        </p>

        <nav className="mt-4 space-y-2">
          <Link
            href="/dashboard"
            onClick={onNavigate}
            className={navLinkClassName(isProfileActive)}
          >
            <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center">
              <UserRound className="h-4 w-4 text-[#4b5964]" />
            </span>
            <span
              className="text-base font-normal"
              style={{ fontFamily: "var(--hp-font-body)" }}
            >
              Profile
            </span>
          </Link>

          <Link
            href="/bookings"
            onClick={onNavigate}
            className={navLinkClassName(isBookingsActive)}
          >
            <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center">
              <BookMarked className="h-4 w-4 text-[#4b5964]" />
            </span>
            <span
              className="text-base font-normal"
              style={{ fontFamily: "var(--hp-font-body)" }}
            >
              Bookings
            </span>
          </Link>
        </nav>

        <button
          type="button"
          className="mt-12 !inline-flex min-h-12 items-center gap-3 px-4 text-[#b71c1c] transition hover:text-[#8e1414]"
        >
          <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center">
            <LogOut className="h-4 w-4" />
          </span>
          <span
            className="text-base font-medium"
            style={{ fontFamily: "var(--hp-font-body)" }}
          >
            Sign Out
          </span>
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
