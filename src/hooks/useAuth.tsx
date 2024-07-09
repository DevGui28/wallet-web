"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { cookiesName } from "@/constants";

type AuthContextType = {
  isLoading: boolean;
  isLogged: boolean;
  updateToken: (token: string) => void;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState("");

  useEffect(() => {
    const getToken = Cookies.get(cookiesName.token);
    if (getToken) {
      setToken(getToken);
    }
    setIsLoading(false);
  }, [])

  function updateToken(token: string) {
    Cookies.set(cookiesName.token, token);
    setToken(token);
  }

  const isLogged = !!token;

  return (
    <AuthContext.Provider value={{ isLoading, isLogged, updateToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
