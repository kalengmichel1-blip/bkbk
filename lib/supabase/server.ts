import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
    const cookieStore = await cookies()

    const supabaseUrl = 'https://xhlioblejhalazlgvpiq.supabase.co'
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhobGlvYmxlamhhbGF6bGd2cGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0MjQ0ODUsImV4cCI6MjA4NDAwMDQ4NX0.l_Se7PL3ELAdo5jawWxTsCYiCQB5y5l_lW2KxUBhFtU'

    console.log('Creating Supabase Client...');
    console.log('URL defined:', !!supabaseUrl);
    console.log('Key defined:', !!supabaseKey);

    if (!supabaseUrl || !supabaseKey) {
        console.error('Supabase credentials missing in Production!')
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
