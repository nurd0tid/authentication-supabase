import { NextResponse } from 'next/server'

export async function middleware(req) {
  const { pathname } = req.nextUrl
  const res = NextResponse.next()
  
  const currentUser = req.cookies.get("currentUser")?.value;
  // console.log(JSON.parse(currentUser).accessToken)
  const expiresAt = currentUser && new Date(JSON.parse(currentUser).expiresAt);

  // if user is signed in and the current path is /authentication redirect the user to /account
  if (currentUser && Date.now() > expiresAt) {
    return NextResponse.redirect(new URL('/', req.url), {
      headers: {
        'Set-Cookie': 'currentUser=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly'
      }
    })
  }
  
  // If user is signed in and the current path is / redirect the user to /dashboard
  if (currentUser && req.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // if user is signed in and the current path is /authentication redirect the user to /account
  if (currentUser && req.nextUrl.pathname.startsWith('/authentication')) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }


  // If user is not signed in and the current path is not / or /authentication allow access
  if (!currentUser && (req.nextUrl.pathname !== '/' && !req.nextUrl.pathname.startsWith('/authentication'))) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return res
}

export const config = {
  matcher: [
    '/', 
    '/authentication/:path*', 
    '/dashboard/:path*', 
  ],
}