import { cookiesName } from '@/constants'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL('/login', request.url))

  response.cookies.set(cookiesName.token, '', {
    path: '/',
    maxAge: 0,
  })

  return response
}
