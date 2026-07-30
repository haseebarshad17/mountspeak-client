import type { SVGProps } from 'react'

export default function TwoLineMenu({
    className,
    ...props
}: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 10"
            fill="none"
            className={className ?? 'h-2.5 w-5'}
            aria-hidden
            {...props}
        >
            <path
                d="M0 1.5h20"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
            <path
                d="M8 8.5h12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
        </svg>
    )
}
