import { Jwt } from "@/app/common/interfaces/jwt";
import { cookies } from "@/constants";
import { jwtDecode } from "jwt-decode";
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl
    if (pathname === "/sign-in" || pathname === "/sign-up" || pathname.includes('auth')) {
      return NextResponse.next();
    }

    const authToken = request.cookies.get(cookies.token)?.value;
    if (!authToken) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    const decodedJWT = jwtDecode<Jwt>(authToken);

    if (!decodedJWT) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    if (decodedJWT.exp < Date.now() / 1000) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
}

export const config = {
  matcher: [
    '/((?!sign-in|sign-up).*)',
  ]
}