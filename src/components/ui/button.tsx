"use client";
import * as React from "react";
import { tv, type VariantProps } from "tailwind-variants";
import Link from "next/link";
import { cn } from "@/lib/utils/clsxUtils";

const buttonVariants = tv({
    variants: {
        variant: {
            default: "bg-primary-600 text-white hover:bg-primary-700 hover:shadow-lg hover:shadow-primary-500/30",
            "default-red": "bg-red-600 text-white hover:bg-red-700",
            "default-blue": "bg-blue-600 text-white hover:bg-blue-700",
            "default-purple": "bg-purple-600 text-white hover:bg-purple-700",
            "default-amber": "bg-amber-600 text-white hover:bg-amber-700",

            outline: "border border-gray-300 bg-white text-gray-900 hover:bg-gray-50",
            "outline-primary": "border border-primary-600 text-primary-700 hover:bg-primary-50",
            "outline-red": "border border-red-600 text-red-700 hover:bg-red-50",
            "outline-blue": "border border-blue-600 text-blue-700 hover:bg-blue-50",
            "outline-purple": "border border-purple-600 text-purple-700 hover:bg-purple-50",
            "outline-amber": "border border-amber-600 text-amber-700 hover:bg-amber-50",

            ghost: "hover:bg-gray-200/50 hover:text-gray-900 bg-transparent",
            "ghost-primary": "hover:bg-primary-50 hover:text-primary-900 bg-transparent",
            "ghost-red": "hover:bg-red-50 hover:text-red-900 bg-transparent",
            "ghost-blue": "hover:bg-blue-50 hover:text-blue-900 bg-transparent",
            "ghost-purple": "hover:bg-purple-50 hover:text-purple-900 bg-transparent",
            "ghost-amber": "hover:bg-amber-50 hover:text-amber-950 bg-transparent",

            link: "text-emerald-600 underline-offset-4 hover:underline bg-transparent shadow-none",
            "link-red": "text-red-600 underline-offset-4 hover:underline bg-transparent shadow-none",
            "link-blue": "text-blue-600 underline-offset-4 hover:underline bg-transparent shadow-none",
            "link-amber": "text-amber-600 underline-offset-4 hover:underline bg-transparent shadow-none",

            destructive: "bg-red-600 text-white hover:bg-red-700",
            secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
            transparent: "bg-transparent text-gray-700 hover:bg-transparent",
            faded: "bg-gray-100/50 text-gray-600 hover:bg-gray-100/70 opacity-70",
            "hero-outline": "border border-transparent bg-white text-primary-600 hover:bg-primary-50 hover:border-primary-600",
        },
        size: {
            default: "h-10 px-5 text-sm",
            sm: "h-[36px] px-3 text-sm",
            md: "h-10 px-5 text-sm",
            lg: "h-12 px-6 text-base",
            icon: "h-10 w-10 p-0 text-base",
            max: "w-max h-max"
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
}

interface Ripple {
    x: number;
    y: number;
    key: number;
}

export type ButtonPropsType<C extends React.ElementType = "button"> =
    ButtonProps<C> &
    Omit<React.ComponentPropsWithoutRef<C>, keyof ButtonProps<C>>;

export const Button = <C extends React.ElementType = "button">({
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
    ...props
}: ButtonProps<C> & Omit<React.ComponentPropsWithoutRef<C>, keyof ButtonProps<C>>) => {

    const [ripples, setRipples] = React.useState<Ripple[]>([]);
    const [isPressed, setIsPressed] = React.useState(false);

    const rippleKey = React.useRef(0);
    const pressStart = React.useRef(0);
    const releaseTimeout = React.useRef<NodeJS.Timeout | null>(null);

    const Component: React.ElementType =
        href ? Link : component ?? (asChild ? "div" : "button");

    const handleMouseDown = (e: React.MouseEvent) => {
        if (shouldScale) {
            pressStart.current = Date.now();
            setIsPressed(true);
        }
        props.onMouseDown?.(e);
    };

    const handleMouseUp = (e: React.MouseEvent) => {
        props.onMouseUp?.(e);

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
            style={{
                transform: shouldScale && isPressed ? "scale(0.94)" : "scale(1)",
                transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
                ...props.style,
            }}
            className={cn(
                "relative flex w-full items-center justify-center gap-2 rounded-md font-medium outline-none sm:inline-flex sm:w-auto",
                "cursor-pointer overflow-hidden px-[30px]",
                "focus-visible:ring-0 focus-visible:ring-none focus-visible:ring-offset-0",
                "disabled:pointer-events-none disabled:opacity-50",
                "cubic-bezier(0.22, 1, 0.36, 1) !transition-all",
                buttonVariants({ variant, size }),
                className
            )}

            {...props}
            href={href}

            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
        >
            {children}

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
};