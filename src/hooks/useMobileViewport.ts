import { useEffect, useState } from 'react'

const MOBILE_MEDIA_QUERY = '(max-width: 639px)'

export function useMobileViewport(): boolean {
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const mediaQuery = window.matchMedia(MOBILE_MEDIA_QUERY)
        setIsMobile(mediaQuery.matches)

        const onChange = () => {
            setIsMobile(mediaQuery.matches)
        }

        mediaQuery.addEventListener('change', onChange)
        return () => mediaQuery.removeEventListener('change', onChange)
    }, [])

    return isMobile
}
