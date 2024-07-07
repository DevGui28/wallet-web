import axiosInstance from "@/api/axiosInstance";
import Image from "next/image";

export default async function Header() {
  const {name} = await (await axiosInstance.get('/auth/name')).data

  return (
    <header className="flex flex-col">
      <Image src="/wallet-logo.png" alt="Logo" width={300} height={100}/>
      <h1>Bem vindo(a), {name}</h1>
    </header>
  );
}