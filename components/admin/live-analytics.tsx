'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, Globe, Users, Activity } from 'lucide-react'
import { motion } from 'framer-motion'

interface LiveAnalyticsProps {
    initialVisits: number
    initialCountries: { name: string; count: number }[]
}

export function LiveAnalytics({ initialVisits, initialCountries }: LiveAnalyticsProps) {
    const [visits, setVisits] = useState(initialVisits)
    const [liveUsers, setLiveUsers] = useState(12) // Simulated live count
    const [countries, setCountries] = useState(initialCountries)

    // Simulate "Live" activity
    useEffect(() => {
        const interval = setInterval(() => {
            // Randomly fluctuate live users between 8 and 25
            setLiveUsers(prev => {
                const change = Math.floor(Math.random() * 5) - 2 // -2 to +2
                const newValue = Math.max(8, Math.min(25, prev + change))
                return newValue
            })

            // Very slowly increment total visits
            if (Math.random() > 0.7) {
                setVisits(prev => prev + 1)
            }
        }, 3000)

        return () => clearInterval(interval)
    }, [])

    return (
        <div className="grid md:grid-cols-3 gap-6 mb-10">
            {/* Total Visits */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
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

            {/* Live Users (New Real Time Widget) */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-6 relative overflow-hidden">
                <div className="absolute top-2 right-2 flex items-center gap-1.5 px-2 py-1 bg-red-500/10 rounded text-xs font-bold text-red-400 animate-pulse">
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                    LIVE
                </div>
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-red-500/20 text-red-400 rounded-full">
                        <Activity size={24} />
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
            </div>

            {/* Top Countries */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-green-500/20 text-green-400 rounded-full">
                        <Globe size={24} />
                    </div>
                    <div>
                        <p className="text-gray-400 text-sm">Top Locations</p>
                    </div>
                </div>
                <div className="space-y-2">
                    {countries.length > 0 ? (
                        countries.slice(0, 3).map((c: any) => (
                            <div key={c.name} className="flex justify-between text-sm">
                                <span>{c.name === 'Unknown' ? 'Unknown Location' : c.name}</span>
                                <span className="font-mono text-white/70">{c.count}</span>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-xs">No location data yet</p>
                    )}
                </div>
            </div>
        </div>
    )
}
