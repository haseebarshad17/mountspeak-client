"use client";

import { useState } from "react";
import { BookMarked, LogOut, UserRound } from "lucide-react";

const DashboardSidebar = () => {
  const [activeItem, setActiveItem] = useState<"profile" | "bookings">("profile");

  return (
    <aside className="w-full md:w-[264px] md:min-w-[264px] md:max-w-[264px]">
      <div >
        <p
          className="text-[12px] font-semibold uppercase tracking-[0.6px] pl-2 text-[#707979]"
          style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
        >
          Account Settings
        </p>

        <nav className="mt-4 space-y-2">
          <button
            type="button"
            onClick={() => setActiveItem("profile")}
            className={`flex min-h-[48px] max-w-[264px] w-full items-center gap-3 px-4 text-left text-base transition ${
              activeItem === "profile"
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
          </button>

          <button
            type="button"
            onClick={() => setActiveItem("bookings")}
            className={`flex h-12 w-full max-w-[264px] items-center gap-3 px-4 text-left transition ${
              activeItem === "bookings"
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
          </button>
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
