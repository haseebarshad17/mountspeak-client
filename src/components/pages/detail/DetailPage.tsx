"use client"

import { Menu } from "lucide-react"
import Image from "next/image"
import TourPageContent from "@/components/pages/tour/TourPageContent"

export default function DetailPage() {
    return (
        <main className="bg-[#F5F5F2]">
            <div className="relative">
                <div className="pointer-events-none absolute inset-x-0 top-0 z-20">
                    <div className="mx-auto flex w-full max-w-[1182px] items-center justify-between px-4 pt-4 sm:px-6 sm:pt-6">
                        <Image
                            src="/images/generic/agency-logo-white.svg"
                            alt="logo"
                            width={52}
                            height={20}
                            className="h-auto w-[52px] sm:w-[64px]"
                            priority
                        />
                        <button
                            type="button"
                            aria-label="Open menu"
                            className="pointer-events-auto inline-flex h-8 w-8 items-center justify-center rounded-md border border-white/40 bg-black/20 text-white backdrop-blur-sm"
                        >
                            <Menu className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                <TourPageContent tourSlug="hunza-valley-fairy-meadows" />
            </div>
        </main>
    )
}
