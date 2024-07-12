import { welcomePerson } from '@/lib/useful'
import Image from 'next/image'

export default function Header() {
  return (
    <header className="flex h-20 w-screen items-center justify-center bg-blue-600 px-10">
      <div className="flex w-full flex-col">
        <h1 className="poppins-bold text-gray-900">
          Ei, Bem vindo(a) devolta!
        </h1>
        <p className="-mt-1.5 text-sm font-medium text-gray-900">
          {welcomePerson(new Date())}
        </p>
      </div>
      <Image src="/profile-icon.svg" alt="profile" width={35} height={35} />
    </header>
  )
}
