'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { recordVisit } from '@/app/actions/analytics'

export function VisitTracker() {
    const pathname = usePathname()

    useEffect(() => {
        if (pathname?.startsWith('/admin')) return // Don't track admin pages using same logic? Or maybe we do.

        // Simple debounce or just fire. Next.js triggers this on client nav.
        recordVisit(pathname)
    }, [pathname])

    return null
}
