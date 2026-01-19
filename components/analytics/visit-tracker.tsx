'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { recordVisit } from '@/app/actions/analytics'

import { createClient } from '@/lib/supabase/client'

export function VisitTracker() {
    const pathname = usePathname()
    const supabase = createClient()

    useEffect(() => {
        if (!pathname || pathname.startsWith('/admin')) return

        // 1. Record History (DB)
        recordVisit(pathname)

        // 2. Realtime Presence
        const channel = supabase.channel('online-users')
        channel.subscribe(async (status: string) => {
            if (status === 'SUBSCRIBED') {
                await channel.track({
                    view: pathname,
                    online_at: new Date().toISOString(),
                })
            }
        })

        return () => {
            supabase.removeChannel(channel)
        }
    }, [pathname, supabase])

    return null
}
