"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { usePreviewPath } from "@/hooks/useAgencyPreviewBase";
import { HP_THEME_ICON_BTN_CLASS } from "@/data/homepage";
import { cn } from "@/lib/utils/clsxUtils";

const authSideImageSrc = encodeURI(
  "/images/pages/auth/Section - Image Side (Hidden on Mobile) (1).svg",
);

export default function AuthSidePanel() {
  const homePath = usePreviewPath("/");

  return (
    <div className="relative hidden overflow-hidden md:block md:w-1/2">
      <Image
        src={authSideImageSrc}
        alt="Discover the rugged beauty"
        fill
        priority
        className="object-cover object-center"
      />
      <div className="absolute inset-0 px-10">
        <div className="mx-auto flex h-full w-full max-w-[512px] flex-col">
          <Link
            href={homePath}
            aria-label="Back to homepage"
            className={cn(
              "mt-10 !inline-flex h-10 w-10 items-center justify-center text-white transition",
              HP_THEME_ICON_BTN_CLASS,
            )}
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={2} aria-hidden />
          </Link>

          <div className="mt-auto pb-[60px] text-[#111827]">
            <h2
              className="text-[48px] font-semibold leading-[56px]"
            >
              Discover the rugged beauty.
            </h2>
            <p
              className="mt-5 text-[18px] leading-[28px] text-[#1A1C1E]"
            >
              Experience the raw grandeur of Pakistan&apos;s peaks with the world&apos;s
              most trusted expedition partner.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
