"use client";

import Link from "next/link";

interface TentaLogoProps {
    href?: string;
    textClassName?: string;
    markClassName?: string;
    className?: string;
    showText?: boolean;
}

export default function Logo({
    href = "/",
    textClassName = "font-heading text-2xl tracking-tight text-neutral-900",
    markClassName = "h-10 w-10 rounded-xl",
    className = "flex items-center gap-2",
    showText = true,
}: TentaLogoProps) {
    return (
        <Link href={href} className={className}>
            <div
                className={`flex items-center justify-center bg-gradient-to-br from-primary-400 to-primary-600 ${markClassName}`}
            >
                <span className="text-xl font-bold text-white">T</span>
            </div>
            {showText ? <span className={textClassName}>Tenta</span> : null}
        </Link>
    );
}
