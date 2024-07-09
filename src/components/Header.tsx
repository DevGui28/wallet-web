import axiosInstance from "@/api/axiosInstance";
import Image from "next/image";

export default function Header() {
  return (
    <header className="flex flex-col bg-[#15d1d1] h-[70px] justify-center">
      <Image src="/wallet-logo.png" alt="Logo" width={350} height={71}/>
    </header>
  );
}