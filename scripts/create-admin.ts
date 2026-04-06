import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xhlioblejhalazlgvpiq.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhobGlvYmxlamhhbGF6bGd2cGlxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODQyNDQ4NSwiZXhwIjoyMDg0MDAwNDg1fQ.h8jGoUV8_kLJShc1XKvxhGWpjm2AoddC8AcOqFTKv8E'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createAdmin() {
    const email = 'kalengmichel1@gmail.com'
    const password = 'TemporaryPassword123!'

    console.log(`Creating user: ${email}...`)

    const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
            full_name: 'Michel Kalenga'
        }
    })

    if (error) {
        console.error('Error creating user:', error.message)
        return
    }

    console.log('User created successfully:', data.user.id)

    // Also create profile
    const { error: profileError } = await supabase
        .from('profiles')
        .insert({
            id: data.user.id,
            full_name: 'Admin User',
            username: 'admin',
            updated_at: new Date().toISOString(),
        })

    if (profileError) {
        console.error('Error creating profile:', profileError.message)
    } else {
        console.log('Profile created successfully.')
    }
}

createAdmin()
