'use client'

import axiosInstance from "@/api/axiosInstance";
import { useAuth } from "@/hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type Login = z.infer<typeof loginSchema>;

export default function SignIn() {
  const [error, setError] = useState<string | null>(null);
  const { updateToken } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Login>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: Login) {
    try {
      setError(null);
      const { data: res } = await axiosInstance.post("/auth/login", data);
      updateToken(res.token);
      router.push("/dashboard");      
    } catch (error: any) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          setError("E-mail ou senha incorretos");
          return;
        }
        setError("Ocorreu um erro inesperado");
      }
    }
  }

  return (
    <div className="flex">
      <div className="h-screen w-screen bg-gray-900">
        <div className="flex h-full flex-col items-center justify-center">
          <h1 className="text-5xl text-white">Wallet</h1>
          <form className="mt-5 flex w-1/2 flex-col justify-center"
            onSubmit={handleSubmit(onSubmit)}
          >
            <input
              type="text"
              placeholder="E-mail"
              className="mb-3 rounded-md border border-gray-300 p-2"
              {...register("email")}
            />
            <input
              type="password"
              placeholder="Senha"
              className="mb-3 rounded-md border border-gray-300 p-2"
              {...register("password")}
            />
            {error && <p className="text-red-500 text-center text-sm">{error}</p>}
            <button className="rounded-md bg-green-700 p-2 text-white mt-5">
              Entrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
