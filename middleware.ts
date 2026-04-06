import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    // Appwrite relies on standard HTTP cookie management, 
    // we don't need a custom refresh middleware like Supabase does.
    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - images/ (public images)
         * - assets/ (new public assets)
         */
        '/((?!_next/static|_next/image|favicon.ico|images/|assets/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
