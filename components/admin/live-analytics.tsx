'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, Globe, Activity, Eye, Calendar } from 'lucide-react'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'

interface LiveAnalyticsProps {
    initialVisits: number
    initialVisitsToday: number
    initialCountries: { name: string; count: number }[]
}

export function LiveAnalytics({ initialVisits, initialVisitsToday, initialCountries }: LiveAnalyticsProps) {
    const [visits] = useState(initialVisits)
    const [visitsToday] = useState(initialVisitsToday)
    const [liveUsers, setLiveUsers] = useState(0)
    const [activePages, setActivePages] = useState<Record<string, number>>({})

    // Realtime Presence Logic
    useEffect(() => {
        const supabase = createClient()
        const channel = supabase.channel('online-users')

        channel
            .on('presence', { event: 'sync' }, () => {
                const state = channel.presenceState()
                const validUsers = Object.keys(state)
                setLiveUsers(validUsers.length)

                // Aggregate views
                const pages: Record<string, number> = {}
                Object.values(state).forEach((presences: any) => {
                    presences.forEach((p: any) => {
                        if (p.view) {
                            pages[p.view] = (pages[p.view] || 0) + 1
                        }
                    })
                })
                setActivePages(pages)
            })
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    return (
        <div className="space-y-6 mb-10">
            <div className="grid md:grid-cols-4 gap-6">
                {/* Active Users (Realtime) */}
                <div className="bg-white/5 border border-white/10 rounded-lg p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Activity size={60} />
                    </div>
                    <div className="absolute top-2 right-2 flex items-center gap-1.5 px-2 py-1 bg-red-500/10 rounded text-xs font-bold text-red-400 animate-pulse">
                        <div className="w-2 h-2 bg-red-500 rounded-full" />
                        LIVE
                    </div>
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-red-500/20 text-red-400 rounded-full">
                            <Activity size={24} />
                        </div>
                    </div>
                    <div>
                        <p className="text-gray-400 text-sm">Active Users Now</p>
                        <motion.h3
                            key={liveUsers}
                            initial={{ scale: 1.2, color: '#f87171' }}
                            animate={{ scale: 1, color: '#ffffff' }}
                            className="text-3xl font-bold"
                        >
                            {liveUsers}
                        </motion.h3>
                    </div>
                </div>

                {/* Visits Today */}
                <div className="bg-white/5 border border-white/10 rounded-lg p-6 group">
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Calendar size={60} />
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-purple-500/20 text-purple-400 rounded-full">
                            <Calendar size={24} />
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">Visits Today</p>
                            <h3 className="text-3xl font-bold">{visitsToday.toLocaleString()}</h3>
                        </div>
                    </div>
                </div>

                {/* Total Visits */}
                <div className="bg-white/5 border border-white/10 rounded-lg p-6 group">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-blue-500/20 text-blue-400 rounded-full">
                            <TrendingUp size={24} />
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">Total Visits</p>
                            <h3 className="text-3xl font-bold">{visits.toLocaleString()}</h3>
                        </div>
                    </div>
                </div>

                {/* Top Locations */}
                <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-green-500/20 text-green-400 rounded-full">
                            <Globe size={24} />
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">Top Locations</p>
                        </div>
                    </div>
                    <div className="space-y-1">
                        {initialCountries.slice(0, 2).map((c: any) => (
                            <div key={c.name} className="flex justify-between text-xs text-gray-300">
                                <span className="truncate max-w-[100px]">{c.name === 'Unknown' ? 'Unknown' : c.name}</span>
                                <span className="font-mono text-white/70">{c.count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Live Page Views Table */}
            {liveUsers > 0 && (
                <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <Eye size={20} className="text-blue-400" />
                        Right Now Viewing
                    </h3>
                    <div className="space-y-2">
                        {Object.entries(activePages).map(([page, count]) => (
                            <div key={page} className="flex items-center justify-between p-3 bg-black/20 rounded hover:bg-white/5 transition-colors">
                                <span className="text-sm font-mono text-blue-300 truncate">{page}</span>
                                <span className="text-xs font-bold bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                                    {count} {count === 1 ? 'viewer' : 'viewers'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
