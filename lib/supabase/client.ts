import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xhlioblejhalazlgvpiq.supabase.co'
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhobGlvYmxlamhhbGF6bGd2cGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0MjQ0ODUsImV4cCI6MjA4NDAwMDQ4NX0.l_Se7PL3ELAdo5jawWxTsCYiCQB5y5l_lW2KxUBhFtU'

    if (!supabaseUrl || !supabaseKey || supabaseUrl === 'your-project-url') {
        console.warn('Supabase credentials missing. Returning stub client.')
        return {
            auth: {
                signInWithPassword: async () => ({ data: null, error: { message: 'Supabase Credentials Missing in .env.local' } }),
            },
            storage: {
                from: () => ({
                    upload: async () => ({ error: { message: 'Supabase not configured' } }),
                    getPublicUrl: () => ({ data: { publicUrl: '' } })
                })
            }
        } as any
    }

    return createBrowserClient(
        supabaseUrl,
        supabaseKey
    )
}
