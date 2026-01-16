import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
    const cookieStore = await cookies()

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey || supabaseUrl === 'your-project-url') {
        console.warn('Supabase credentials missing. Returning stub client.')
        // Return a dummy client that satisfies the interface but does nothing/throws clear error on use
        return {
            auth: {
                getUser: async () => ({ data: { user: null }, error: null }),
                signInWithPassword: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
            },
            from: () => ({
                select: () => ({
                    eq: () => ({
                        single: async () => ({ data: null, error: null }),
                        order: () => ({ limit: async () => ({ data: [] }) }),
                    }),
                    order: () => ({ limit: async () => ({ data: [] }) }),
                }),
                insert: async () => ({ error: { message: 'Supabase not configured' } }),
                update: () => ({ eq: async () => ({ error: { message: 'Supabase not configured' } }) }),
                upsert: async () => ({ error: { message: 'Supabase not configured' } }),
            }),
            storage: {
                from: () => ({
                    upload: async () => ({ error: { message: 'Supabase not configured' } }),
                    getPublicUrl: () => ({ data: { publicUrl: '' } })
                })
            }
        } as any // Cast to any to avoid verifying every single method of the Supabase client
    }

    // URL validation
    try {
        new URL(supabaseUrl)
    } catch {
        console.warn('Invalid Supabase URL. Returning stub client.')
        // Return dummy client (same as above fallback)
        return {
            auth: {
                getUser: async () => ({ data: { user: null }, error: null }),
                signInWithPassword: async () => ({ data: null, error: { message: 'Invalid Supabase URL' } }),
            },
            from: () => ({
                select: () => ({
                    eq: () => ({
                        single: async () => ({ data: null, error: null }),
                        order: () => ({ limit: async () => ({ data: [] }) }),
                    }),
                    order: () => ({ limit: async () => ({ data: [] }) }),
                }),
                insert: async () => ({ error: { message: 'Invalid Supabase Configuration' } }),
                update: () => ({ eq: async () => ({ error: { message: 'Invalid Supabase Configuration' } }) }),
                upsert: async () => ({ error: { message: 'Invalid Supabase Configuration' } }),
            }),
            storage: {
                from: () => ({
                    upload: async () => ({ error: { message: 'Supabase not configured' } }),
                    getPublicUrl: () => ({ data: { publicUrl: '' } })
                })
            }
        } as any
    }

    try {
        return createServerClient(
            supabaseUrl,
            supabaseKey,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll()
                    },
                    setAll(cookiesToSet) {
                        try {
                            cookiesToSet.forEach(({ name, value, options }) =>
                                cookieStore.set(name, value, options)
                            )
                        } catch {
                            // The `setAll` method was called from a Server Component.
                        }
                    },
                },
            }
        )
    } catch (error) {
        console.warn('Failed to create Supabase client:', error)
        // Fallback return same dummy
        return {
            auth: {
                getUser: async () => ({ data: { user: null }, error: null }),
                signInWithPassword: async () => ({ data: null, error: { message: 'Supabase Error' } }),
            },
            from: () => ({
                select: () => ({
                    eq: () => ({
                        single: async () => ({ data: null, error: null }),
                        order: () => ({ limit: async () => ({ data: [] }) }),
                    }),
                    order: () => ({ limit: async () => ({ data: [] }) }),
                }),
            }),
            storage: {
                from: () => ({
                    upload: async () => ({ error: { message: 'Supabase not configured' } }),
                    getPublicUrl: () => ({ data: { publicUrl: '' } })
                })
            }
        } as any
    }
}
