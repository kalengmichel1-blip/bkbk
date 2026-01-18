import { createClient } from '@supabase/supabase-js'

export function createAdminClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xhlioblejhalazlgvpiq.supabase.co'
    // Prefer env var, fallback to the hardcoded key if necessary (though env var is better for secrets)
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhobGlvYmxlamhhbGF6bGd2cGlxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODQyNDQ4NSwiZXhwIjoyMDg0MDAwNDg1fQ.h8jGoUV8_kLJShc1XKvxhGWpjm2AoddC8AcOqFTKv8E'

    // Standard client, no auth helper needed for admin operations usually
    return createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    })
}
