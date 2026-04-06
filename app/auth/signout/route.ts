import { createSessionClient } from '@/lib/appwrite/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { type NextRequest } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
    const { account } = await createSessionClient()

    if (account) {
        try {
            await account.deleteSession('current')
        } catch(e) {
            console.error('Appwrite signout error:', e)
        }
    }

    const cookieStore = await cookies()
    cookieStore.delete('appwrite-session')

    revalidatePath('/', 'layout')
    redirect('/login')
}
