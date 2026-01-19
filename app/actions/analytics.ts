'use server'

import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'

export async function recordVisit(pathname: string) {
    try {
        const supabase = await createClient()
        const headersList = await headers()
        const country = headersList.get('x-vercel-ip-country') || 'Unknown'
        const city = headersList.get('x-vercel-ip-city') || 'Unknown'
        // Simple device detection could be added here via user-agent logic if needed

        await supabase.from('analytics').insert({
            page: pathname,
            country,
            city,
        })
    } catch (error) {
        console.error('Failed to record visit:', error)
        // We don't throw here to avoid breaking the UI for the user
    }
}

export async function getAnalyticsStats() {
    const supabase = await createClient()

    // Total visits
    const { count: totalVisits } = await supabase
        .from('analytics')
        .select('*', { count: 'exact', head: true })

    // Visits Today
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const { count: visitsToday } = await supabase
        .from('analytics')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today.toISOString())

    // Top countries (Simulated aggregation since Supabase client doesn't do complex GROUP BY easily without RPC)
    // For a small scale, we can fetch latest 1000 or use a simpler approach. 
    // Ideally, we'd make a Postgres RPC function for this. 
    // For now, let's fetch IDs and countries to aggregate in memory (limit to last 1000 for perf).
    const { data } = await supabase
        .from('analytics')
        .select('country')
        .order('created_at', { ascending: false })
        .limit(1000)

    const countryStats: Record<string, number> = {}
    data?.forEach((row: { country: string | null }) => {
        const c = row.country || 'Unknown'
        countryStats[c] = (countryStats[c] || 0) + 1
    })

    const topCountries = Object.entries(countryStats)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([name, count]) => ({ name, count }))

    return {
        totalVisits: totalVisits || 0,
        visitsToday: visitsToday || 0,
        topCountries
    }
}
