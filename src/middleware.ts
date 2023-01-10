import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const session = request.cookies.get("sid");

  if (session != undefined) return NextResponse.next();
  
  const response = NextResponse.rewrite(new URL(`/auth/login`, request.headers.get("origin")?? request.url));

  response.headers.set("error", "Please login first");
  
  return response;
}

export const config = {
  matcher: ["/account", "/account/:path*"]
}