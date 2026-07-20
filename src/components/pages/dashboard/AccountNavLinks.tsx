"use client";

import Link from "next/link";
import { BookMarked, Compass, Heart, UserRound } from "lucide-react";
import { useInternalPathname, usePreviewPath } from "@/hooks/useAgencyPreviewBase";
import { useTourOrPackageCopy } from "@/hooks/useTourOrPackageCopy";
import { cn } from "@/lib/utils/clsxUtils";

type AccountNavLinksProps = {
  onNavigate?: () => void;
  variant?: "sidebar" | "drawer";
  drawerTone?: "dark" | "light";
};

const sidebarLinkClassName = (isActive: boolean) =>
  cn(
    "!flex min-h-12 w-full max-w-[264px] items-center gap-3 rounded-md border border-l-4 px-4 text-left transition",
    isActive
      ? "border-[#e4ebee] border-l-[var(--hp-color-primary)] bg-[#0640451A] text-[#1a1c1e]"
      : "border-transparent border-l-transparent text-[#2f3b45] hover:bg-[#0640451A]",
  );

const drawerLinkClassName = (isActive: boolean, tone: "dark" | "light") =>
  cn(
    "flex min-h-11 w-full items-center gap-3 rounded-lg px-3 py-3 text-base font-medium transition",
    tone === "light"
      ? cn(
        "text-neutral-800 hover:bg-neutral-100",
        isActive && "bg-neutral-100 font-semibold",
      )
      : cn(
        "text-white hover:bg-white/15",
        isActive && "bg-white/15 font-semibold",
      ),
  );

export function AccountNavLinks({
  onNavigate,
  variant = "sidebar",
  drawerTone = "dark",
}: AccountNavLinksProps) {
  const internalPathname = useInternalPathname();
  const { copy, savedListingsLabel } = useTourOrPackageCopy();
  const dashboardPath = usePreviewPath("/dashboard");
  const bookingsPath = usePreviewPath("/bookings");
  const savedToursPath = usePreviewPath("/saved-tours");
  const toursPath = usePreviewPath("/search");
  const isProfileActive = internalPathname.startsWith("/dashboard");
  const isBookingsActive = internalPathname.startsWith("/bookings");
  const isSavedToursActive = internalPathname.startsWith("/saved-tours");
  const isToursActive = internalPathname === "/search" || internalPathname.startsWith("/search/");
  const savedToursLabel = savedListingsLabel;
  const linkClassName =
    variant === "drawer"
      ? (isActive: boolean) => drawerLinkClassName(isActive, drawerTone)
      : sidebarLinkClassName;

  if (variant === "drawer") {
    return (
      <div className="flex flex-col gap-1">
        <p
          className={cn(
            "px-3 pb-1 text-xs font-semibold uppercase tracking-[0.12em]",
            drawerTone === "light" ? "text-neutral-500" : "text-white/70",
          )}
        >
          Account
        </p>
        <Link
          href={dashboardPath}
          onClick={onNavigate}
          className={linkClassName(isProfileActive)}
        >
          <UserRound
            className={cn(
              "h-4 w-4 shrink-0",
              drawerTone === "light" ? "text-neutral-600" : "text-white/90",
            )}
            aria-hidden
          />
          <span>Profile</span>
        </Link>
        <Link
          href={bookingsPath}
          onClick={onNavigate}
          className={linkClassName(isBookingsActive)}
        >
          <BookMarked
            className={cn(
              "h-4 w-4 shrink-0",
              drawerTone === "light" ? "text-neutral-600" : "text-white/90",
            )}
            aria-hidden
          />
          <span>Bookings</span>
        </Link>
        <Link
          href={savedToursPath}
          onClick={onNavigate}
          className={linkClassName(isSavedToursActive)}
        >
          <Heart
            className={cn(
              "h-4 w-4 shrink-0",
              drawerTone === "light" ? "text-neutral-600" : "text-white/90",
            )}
            aria-hidden
          />
          <span>{savedToursLabel}</span>
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
      <Link href={savedToursPath} onClick={onNavigate} className={linkClassName(isSavedToursActive)}>
        <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center">
          <Heart className="h-4 w-4 text-[#4b5964]" />
        </span>
        <span className="text-base font-normal">{savedToursLabel}</span>
      </Link>
      <Link href={toursPath} onClick={onNavigate} className={linkClassName(isToursActive)}>
        <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center">
          <Compass className="h-4 w-4 text-[#4b5964]" />
        </span>
        <span className="text-base font-normal">{copy.listingsNavLabel}</span>
      </Link>
    </nav>
  );
}
