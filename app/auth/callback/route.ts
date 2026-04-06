import { NextResponse } from 'next/server'
// Appwrite typically handles OAuth / Magic URL callbacks differently (often directly on the frontend or using userId and secret).
// For Appwrite password recovery or magic link, you typically handle it via the Appwrite SDK on a specific page.
// We are keeping this route redirect for compatibility if external links still point here.

export async function GET(request: Request) {
    const requestUrl = new URL(request.url)
    const next = requestUrl.searchParams.get('next') || '/admin/dashboard'
    
    // Pass query params along in case the destination page needs them (like userId and secret for Appwrite)
    const forwardUrl = new URL(next, requestUrl.origin);
    requestUrl.searchParams.forEach((value, key) => {
        if (key !== 'next' && key !== 'code') {
            forwardUrl.searchParams.set(key, value);
        }
    });

    return NextResponse.redirect(forwardUrl.toString())
    return NextResponse.redirect(`${requestUrl.origin}${next}`)
}
