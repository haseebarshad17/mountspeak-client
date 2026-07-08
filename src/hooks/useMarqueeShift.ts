import { useCallback, useEffect, useState, type RefObject } from 'react'

const MARQUEE_SPEED_PX_PER_SEC = 55
const MIN_DURATION_SEC = 20

function readFlexGapPixels(element: HTMLElement): number {
    const styles = window.getComputedStyle(element)
    const raw = styles.columnGap && styles.columnGap !== 'normal' ? styles.columnGap : styles.gap
    const parsed = Number.parseFloat(raw)
    return Number.isFinite(parsed) ? parsed : 0
}

export function useMarqueeShift(
    copyRef: RefObject<HTMLElement | null>,
    trackRef: RefObject<HTMLElement | null>,
    remeasureToken: number,
): { shift: number; duration: number; copyCount: number } {
    const [shift, setShift] = useState(0)
    const [copyCount, setCopyCount] = useState(2)

    const measure = useCallback(() => {
        const copyElement = copyRef.current
        const trackElement = trackRef.current
        if (!copyElement || !trackElement) return

        const copyWidth = copyElement.getBoundingClientRect().width
        if (copyWidth <= 0) return

        const gap = readFlexGapPixels(trackElement)
        const loopDistance = copyWidth + gap

        setShift((current) => (Math.abs(current - loopDistance) < 1 ? current : loopDistance))

        const container = trackElement.parentElement
        const containerWidth = container?.getBoundingClientRect().width ?? 0
        const copiesNeeded = Math.max(
            2,
            Math.ceil((containerWidth + loopDistance) / loopDistance) + 1,
        )

        setCopyCount((current) => (current === copiesNeeded ? current : copiesNeeded))
    }, [copyRef, trackRef])

    useEffect(() => {
        measure()

        const copyElement = copyRef.current
        if (!copyElement) return

        const resizeObserver = new ResizeObserver(() => {
            measure()
        })

        resizeObserver.observe(copyElement)

        const container = trackRef.current?.parentElement
        if (container) {
            resizeObserver.observe(container)
        }

        window.addEventListener('resize', measure)

        return () => {
            resizeObserver.disconnect()
            window.removeEventListener('resize', measure)
        }
    }, [measure, remeasureToken, copyRef, trackRef])

    const duration =
        shift > 0 ? Math.max(MIN_DURATION_SEC, shift / MARQUEE_SPEED_PX_PER_SEC) : 0

    return { shift, duration, copyCount }
}
