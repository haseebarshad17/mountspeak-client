"use client";

import { useEffect, useState } from "react";

type BreakpointKey = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
type Direction = "up" | "down";

const breakpoints: Record<BreakpointKey, number> = {
    xs: 480,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1170,
    "2xl": 1280,
};

export function useBreakpoint<K extends BreakpointKey>(
    breakpointKey: K,
    direction: Direction = "up",
): boolean {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const pxValue = breakpoints[breakpointKey];

        const check = () => {
            const width = window.innerWidth;
            const result = direction === "up" ? width >= pxValue : width < pxValue;
            setMatches(result);
        };

        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, [breakpointKey, direction]);

    return matches;
}
