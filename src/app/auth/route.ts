import { NextRequest, NextResponse } from 'next/server'
import { urls, cookies } from '@/constants'
import { jwtDecode } from 'jwt-decode'
import { Jwt } from '@/app/common/interfaces/jwt'

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')
  console.log('token', token);
  
  if (!token) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  const decodedJWT = jwtDecode<Jwt>(token)
  
  if (!decodedJWT) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
  
  const response = NextResponse.redirect(`${urls.walletWeb}`)

  response.cookies.set(cookies.token, token, {
    path: '/',
    maxAge: 2592000,
  })

  return response
}
