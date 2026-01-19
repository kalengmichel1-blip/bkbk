'use server'

import { createAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"

export async function createUser(firstName: string, email: string, password: string) {
    const supabase = createAdminClient()

    const { data: user, error } = await supabase.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true,
        user_metadata: {
            full_name: firstName // storing name in metadata for simplicity
        }
    })

    if (error) {
        return { error: error.message }
    }

    // Optionally create profile record if your schema requires it
    // But since profile creation triggers on auth.users insert often, check schema.
    // Our schema has 'profiles' table but no trigger. We should insert it manually to be safe.

    const { error: profileError } = await supabase
        .from('profiles')
        .insert({
            id: user.user.id,
            full_name: firstName,
            username: email.split('@')[0], // Generate simple username
            updated_at: new Date().toISOString(),
        })

    if (profileError) {
        console.error('Profile creation failed:', profileError)
        // We don't fail the whole action, user exists
    }

    revalidatePath('/admin/users')
    return { success: true }
}
