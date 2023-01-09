import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const session = request.cookies.get("sid");

  if (session != undefined) return NextResponse.next();

  const origin = request.headers.get("referer");
  
  const response = NextResponse.redirect(`${origin}auth/login`);

  response.headers.set("error", "Please login first");
  
  return response;
}

export const config = {
  matcher: ["/account", "/account/:path*"]
}