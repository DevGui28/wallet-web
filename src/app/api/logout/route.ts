import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { tokenName } from '../../../constants/cookies'

export async function GET() {
  const cookieStore = cookies()
  cookieStore.delete(tokenName)
  return NextResponse.json(
    { success: true, message: 'Logout realizado com sucesso' },
    { status: 200 }
  )
}
