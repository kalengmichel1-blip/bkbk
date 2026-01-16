import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

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
