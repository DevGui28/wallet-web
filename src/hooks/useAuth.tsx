'use client'

import { parseCookies, setCookie } from 'nookies'
import { createContext, useContext, useEffect, useState } from 'react'
import { tokenName } from '../constants/cookies'

type AuthContextType = {
  isLoading: boolean
  isLogged: boolean
  updateToken: (token: string) => void
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const [token, setToken] = useState('')

  useEffect(() => {
    const cookies = parseCookies()
    const getToken = cookies[tokenName]
    if (getToken) {
      setToken(getToken)
    }
    setIsLoading(false)
  }, [])

  function updateToken(token: string) {
    setCookie(null, tokenName, token)
    setToken(token)
  }

  const isLogged = !!token

  return (
    <AuthContext.Provider value={{ isLoading, isLogged, updateToken }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
