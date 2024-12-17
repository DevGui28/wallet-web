'use client'

import { jwtDecode } from 'jwt-decode'
import { parseCookies } from 'nookies'
import { useState } from 'react'
import { JwtPayload } from '../../../components/app/common/interfaces/jwt'
import TopNav from '../../../components/app/Header/TopNav'
import { tokenName } from '../../../constants/cookies'

export default function CreditCardCreatePage() {
  const cookies = parseCookies()
  const token = cookies[tokenName]
  const payload = jwtDecode<JwtPayload>(token)
  const name = payload.user.name
  const [isSubmitting, setSubmitting] = useState(false)

  return (
    <>
      <TopNav title="Adicionar cartão de crédito" name={name} />
      <div className="flex w-full items-center justify-center px-16">
        <div className="mb-6 w-full max-w-4xl"></div>
      </div>
    </>
  )
}
