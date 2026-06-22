"use client";
import * as React from "react";
import { tv, type VariantProps } from "tailwind-variants";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { usePrefixedHref } from "@/hooks/useAgencyPreviewBase";
import { cn } from "@/lib/utils/clsxUtils";

/** Shared CTA typography — matches auth / form primary buttons site-wide */
export const buttonCtaTypography =
    "text-sm font-semibold uppercase tracking-[0.1em] ![word-spacing:normal]";

const buttonVariants = tv({
    base: [
        "relative !inline-flex flex-nowrap items-center justify-center gap-2 whitespace-nowrap",
        "cursor-pointer outline-none transition-colors",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-70",
        "focus-visible:ring-0",
        buttonCtaTypography,
    ],
    variants: {
        variant: {
            default: "hp-theme-btn",
            "default-red": "bg-red-600 text-white hover:bg-red-700",
            "default-blue": "bg-blue-600 text-white hover:bg-blue-700",
            "default-purple": "bg-purple-600 text-white hover:bg-purple-700",
            "default-amber": "bg-amber-600 text-white hover:bg-amber-700",

            outline:
                "border border-[#C0C8C966] bg-white text-[#1A1C1E] hover:border-[#0f3137]/40",
            "outline-on-dark":
                "border border-[#2f5a62] bg-transparent text-white hover:border-[#2f5a62] hover:bg-[#0a3a43]",
            "outline-primary": "border border-primary-600 text-primary-700 hover:bg-primary-50",
            "outline-red": "border border-red-600 text-red-700 hover:bg-red-50",
            "outline-blue": "border border-blue-600 text-blue-700 hover:bg-blue-50",
            "outline-purple": "border border-purple-600 text-purple-700 hover:bg-purple-50",
            "outline-amber": "border border-amber-600 text-amber-700 hover:bg-amber-50",

            ghost: "bg-transparent hover:bg-gray-200/50 hover:text-gray-900",
            "ghost-primary": "bg-transparent hover:bg-primary-50 hover:text-primary-900",
            "ghost-red": "bg-transparent hover:bg-red-50 hover:text-red-900",
            "ghost-blue": "bg-transparent hover:bg-blue-50 hover:text-blue-900",
            "ghost-purple": "bg-transparent hover:bg-purple-50 hover:text-purple-900",
            "ghost-amber": "bg-transparent hover:bg-amber-50 hover:text-amber-950",

            link: "bg-transparent text-emerald-600 underline-offset-4 shadow-none hover:underline",
            "link-red": "bg-transparent text-red-600 underline-offset-4 shadow-none hover:underline",
            "link-blue": "bg-transparent text-blue-600 underline-offset-4 shadow-none hover:underline",
            "link-amber": "bg-transparent text-amber-600 underline-offset-4 shadow-none hover:underline",

            destructive: "bg-red-600 text-white hover:bg-red-700",
            secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
            transparent: "bg-transparent text-gray-700 hover:bg-transparent",
            faded: "bg-gray-100/50 text-gray-600 opacity-70 hover:bg-gray-100/70",
            "hero-outline":
                "border border-transparent bg-white text-primary-600 hover:border-primary-600 hover:bg-primary-50",
        },
        size: {
            default: "h-11 min-h-11 rounded-md px-6 sm:h-14 sm:min-h-14 sm:px-8",
            sm: "h-9 min-h-9 rounded-md px-4 sm:h-10 sm:min-h-10 sm:px-5",
            md: "h-11 min-h-11 rounded-md px-6 sm:h-14 sm:min-h-14 sm:px-8",
            lg: "h-11 min-h-11 rounded-md px-6 sm:h-14 sm:min-h-14 sm:px-8",
            nav: "h-auto min-h-0 rounded-md px-0 !text-sm xl:!text-base !font-normal !normal-case !tracking-normal",
            icon: "h-10 w-10 min-h-0 rounded-md p-0",
            max: "h-max min-h-0 w-max px-0 !font-normal !normal-case !tracking-normal",
        },
    },
    defaultVariants: {
        variant: "default",
        size: "default",
    },
});

export interface ButtonProps<C extends React.ElementType = "button">
    extends VariantProps<typeof buttonVariants> {
    asChild?: boolean;
    href?: string;
    children: React.ReactNode;
    className?: string;
    component?: C;
    rippleClassName?: string;
    rippleGoesFast?: boolean;
    showRipple?: boolean;
    shouldScale?: boolean;
    loading?: boolean;
    loadingText?: React.ReactNode;
}

interface Ripple {
    x: number;
    y: number;
    key: number;
}

export type ButtonPropsType<C extends React.ElementType = "button"> =
    ButtonProps<C> &
    Omit<React.ComponentPropsWithoutRef<C>, keyof ButtonProps<C>>;

type ButtonElement = HTMLButtonElement | HTMLAnchorElement | HTMLDivElement;

export const Button = React.forwardRef<ButtonElement, ButtonPropsType>(({
    asChild,
    href,
    component,
    variant,
    size,
    className,
    children,
    rippleClassName,
    rippleGoesFast = false,
    showRipple = false,
    shouldScale = false,
    loading = false,
    loadingText,
    disabled,
    ...props
}, ref) => {

    const [ripples, setRipples] = React.useState<Ripple[]>([]);
    const [isPressed, setIsPressed] = React.useState(false);

    const rippleKey = React.useRef(0);
    const pressStart = React.useRef(0);
    const releaseTimeout = React.useRef<NodeJS.Timeout | null>(null);

    const resolvedHref = usePrefixedHref(href)
    const isDisabled = Boolean(disabled || loading)

    const Component: React.ElementType =
        resolvedHref ? Link : component ?? (asChild ? "div" : "button");
    const onMouseDown = props.onMouseDown as React.MouseEventHandler<Element> | undefined;
    const onMouseUp = props.onMouseUp as React.MouseEventHandler<Element> | undefined;

    const handleMouseDown = (e: React.MouseEvent) => {
        if (shouldScale) {
            pressStart.current = Date.now();
            setIsPressed(true);
        }
        onMouseDown?.(e);
    };

    const handleMouseUp = (e: React.MouseEvent) => {
        onMouseUp?.(e);

        if (shouldScale) {
            const duration = Date.now() - pressStart.current;

            if (releaseTimeout.current) {
                clearTimeout(releaseTimeout.current);
            }

            if (duration < 150) {
                releaseTimeout.current = setTimeout(() => setIsPressed(false), 150 - duration);
            } else {
                setIsPressed(false);
            }
        }

        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const key = rippleKey.current++;

        setRipples(prev => [...prev, { x, y, key }]);

        setTimeout(() => {
            setRipples(prev => prev.filter(r => r.key !== key));
        }, 500);
    };

    const handleMouseLeave = () => {
        if (shouldScale) setIsPressed(false);
    };

    return (
        <Component
            ref={ref}
            data-button=""
            style={{
                transform: shouldScale && isPressed ? "scale(0.94)" : "scale(1)",
                transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
                ...props.style,
            }}
            className={cn(
                buttonVariants({ variant, size }),
                className
            )}

            {...props}
            href={resolvedHref}
            disabled={isDisabled}
            aria-busy={loading || undefined}

            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
        >
            {loading ? (
                <>
                    <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden />
                    <span>{loadingText ?? children}</span>
                </>
            ) : (
                children
            )}

            {showRipple && ripples.map(ripple => (
                <span
                    key={ripple.key}
                    className={cn(
                        "absolute w-5 h-5 bg-white/30 rounded-full pointer-events-none",
                        rippleGoesFast ? "animate-ripple-4" : "animate-ripple-8",
                        rippleClassName
                    )}
                    style={{
                        top: ripple.y - 10,
                        left: ripple.x - 10,
                    }}
                />
            ))}
        </Component>
    );
});

Button.displayName = "Button";
