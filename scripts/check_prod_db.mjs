import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xhlioblejhalazlgvpiq.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhobGlvYmxlamhhbGF6bGd2cGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0MjQ0ODUsImV4cCI6MjA4NDAwMDQ4NX0.l_Se7PL3ELAdo5jawWxTsCYiCQB5y5l_lW2KxUBhFtU'

const supabase = createClient(supabaseUrl, supabaseKey)

async function check() {
    const { data, error } = await supabase
        .from('posts')
        .select('status')

    if (error) {
        console.error('Error:', error.message)
    } else {
        const published = data.filter(p => p.status === 'published').length
        const draft = data.filter(p => p.status === 'draft').length
        const archived = data.filter(p => p.status === 'archived').length
        console.log(`Published: ${published}, Draft: ${draft}, Archived: ${archived}`)
    }
}

check()
