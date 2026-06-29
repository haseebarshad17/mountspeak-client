"use client";

import Link from "next/link";
import { BookMarked, UserRound } from "lucide-react";
import { useInternalPathname, usePreviewPath } from "@/hooks/useAgencyPreviewBase";
import { cn } from "@/lib/utils/clsxUtils";

type AccountNavLinksProps = {
  onNavigate?: () => void;
  variant?: "sidebar" | "drawer";
};

const sidebarLinkClassName = (isActive: boolean) =>
  cn(
    "!flex min-h-12 w-full max-w-[264px] items-center gap-3 border border-l-4 px-4 text-left transition",
    isActive
      ? "border-[#e4ebee] border-l-[var(--hp-color-primary)] bg-[#0640451A] text-[#1a1c1e]"
      : "border-transparent border-l-transparent text-[#2f3b45] hover:bg-[#0640451A]",
  );

const drawerLinkClassName = (isActive: boolean) =>
  cn(
    "flex min-h-11 w-full items-center gap-3 rounded-lg px-3 py-3 text-base font-medium text-white transition hover:bg-white/15",
    isActive && "bg-white/15 font-semibold",
  );

export function AccountNavLinks({ onNavigate, variant = "sidebar" }: AccountNavLinksProps) {
  const internalPathname = useInternalPathname();
  const dashboardPath = usePreviewPath("/dashboard");
  const bookingsPath = usePreviewPath("/bookings");
  const isProfileActive = internalPathname.startsWith("/dashboard");
  const isBookingsActive = internalPathname.startsWith("/bookings");
  const linkClassName = variant === "drawer" ? drawerLinkClassName : sidebarLinkClassName;

  if (variant === "drawer") {
    return (
      <div className="flex flex-col gap-1">
        <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-[0.12em] text-white/70">
          Account
        </p>
        <Link
          href={dashboardPath}
          onClick={onNavigate}
          className={linkClassName(isProfileActive)}
        >
          <UserRound className="h-4 w-4 shrink-0 text-white/90" aria-hidden />
          <span>Profile</span>
        </Link>
        <Link
          href={bookingsPath}
          onClick={onNavigate}
          className={linkClassName(isBookingsActive)}
        >
          <BookMarked className="h-4 w-4 shrink-0 text-white/90" aria-hidden />
          <span>Bookings</span>
        </Link>
      </div>
    );
  }

  return (
    <nav className="space-y-2">
      <Link href={dashboardPath} onClick={onNavigate} className={linkClassName(isProfileActive)}>
        <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center">
          <UserRound className="h-4 w-4 text-[#4b5964]" />
        </span>
        <span className="text-base font-normal">Profile</span>
      </Link>
      <Link href={bookingsPath} onClick={onNavigate} className={linkClassName(isBookingsActive)}>
        <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center">
          <BookMarked className="h-4 w-4 text-[#4b5964]" />
        </span>
        <span className="text-base font-normal">Bookings</span>
      </Link>
    </nav>
  );
}
