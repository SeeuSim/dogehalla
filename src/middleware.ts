import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { BASEURL } from 'utils/base';

export async function middleware(request: NextRequest) {
  const session = request.cookies.get("sid");

  if (session != undefined) return NextResponse.next();
  console.log("hi")
  const response = NextResponse.redirect(`${BASEURL}/auth/login`);

  response.headers.set("error", "Please login first");
  return response;
}

export const config = {
  matcher: ["/account", "/account/:path*"]
}