import { NextResponse } from 'next/server'
import verifyToken from './pages/utils/auth/verifyToken';
import checkPermission from './pages/utils/auth/checkPermission';

export async function middleware(req, res) {
  const { pathname } = req.nextUrl;

  // Langsung arahkan ke dashboard jika pengguna mengakses halaman login dalam keadaan sudah login
  if ((pathname === '/authentication/login' || pathname === '/') && req.cookies.get("currentUser")) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // Langsung izinkan untuk halaman yang tidak memerlukan autentikasi
  if (pathname.startsWith('/authentication/login') || pathname.startsWith('/authentication/register') || pathname.startsWith('/authentication/verifyotp')) {
    return NextResponse.next();
  }

  const currentUserCookie = req.cookies.get("currentUser")?.value;
  if (!currentUserCookie) {
    // Tidak ada cookie currentUser, arahkan ke login
    return NextResponse.redirect(new URL('/authentication/login', req.url));
  }

  const { accessToken, expiresAt } = JSON.parse(currentUserCookie);

  if (!accessToken || new Date(expiresAt) < new Date()) {
    // Token tidak ada atau sudah kedaluwarsa, hapus cookie dan arahkan ke login
    return NextResponse.redirect(new URL('/authentication/login', req.url), {
      headers: {
        'Set-Cookie': 'currentUser=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly'
      }
    });
  }

  const { isValid, roleId } = await verifyToken(accessToken);
  
  if (!isValid) {
    return NextResponse.redirect(new URL('/authentication/login', req.url));
  }

  const hasPermission = await checkPermission(roleId, pathname, 'Read');
  if (!hasPermission) {
    // Tidak memiliki izin yang cukup, arahkan ke halaman unauthorized
    return NextResponse.redirect(new URL('/401', req.url));
  }

  // Jika semua kondisi terpenuhi, lanjutkan ke halaman yang dituju
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/', 
    '/authentication/:path*', 
    '/dashboard/:path*', 
    '/blog/:path*', 
    '/features/:path*',
    '/roles/:path*',
    '/users/:path*',
    '/chat/:path*',
  ],
};