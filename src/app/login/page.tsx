"use client";

import axiosInstance from "@/api/axiosInstance";
import { useAuth } from "@/hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email({message: "E-mail inválido"}),
  password: z.string().min(6, {message: "Senha deve ter no mínimo 6 caracteres"})
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
    <div className="flex h-screen w-screen items-center justify-center bg-gray-100">
      <div className="flex max-w-xl flex-col items-center justify-center bg-[#15d1d1] rounded-xl border border-[#9e9e9e] m-6 shadow-xl p-16 md:p-20">
        <Image
          src="/wallet-horizontal.png"
          alt="Logo"
          width={380}
          height={200}
        />
        <form
          className="mt-5 flex w-full max-w-xs flex-col justify-center"
          onSubmit={handleSubmit(onSubmit)}
        >
          <input
            type="text"
            placeholder="E-mail"
            className="mb-2 rounded-md border border-gray-300 p-2"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-center text-sm text-red-500">
              {errors.email.message}
            </p>
          )}
          <input
            type="password"
            placeholder="Senha"
            className="mb-2 rounded-md border border-gray-300 p-2"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-center text-sm text-red-500">
              {errors.password.message}
            </p>
          )}
          <Link className="mt-3 text-center text-sm text-gray-100" href="/register">
            Não tem conta? <span className="text-yellow-200">Crie sua conta</span>
          </Link>
          <button className="mt-5 rounded-md bg-blue-900 p-2 text-white">
            Entrar
          </button>
          {error && <p className="text-center text-sm text-red-500">{error}</p>}
        </form>
      </div>
    </div>
  );
}
