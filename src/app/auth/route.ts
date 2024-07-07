import { NextRequest, NextResponse } from 'next/server'
import {  cookiesName } from '@/constants'
import { jwtDecode } from 'jwt-decode'
import { Jwt } from '@/app/common/interfaces/jwt'
import axiosInstance from '@/api/axiosInstance'

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')
  
  if (!token) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  const decodedJWT = jwtDecode<Jwt>(token)
  
  if (!decodedJWT) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
  
  const response = NextResponse.redirect(new URL('/dashboard', request.url))

  response.cookies.set(cookiesName.token, token, {
    path: '/',
    maxAge: 2592000,
  })
    
  return response
}
