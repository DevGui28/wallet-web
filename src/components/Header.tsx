import { welcomePerson } from '@/lib/useful'
import Image from 'next/image'
import Link from 'next/link'

export default function Header() {
  return (
    <header className="flex h-20 w-screen items-center justify-center bg-blue-600 px-5">
      <div className="flex w-3/5 flex-col">
        <h1 className="poppins-bold text-gray-900">
          Ei, Bem vindo(a) devolta!
        </h1>
        <p className="-mt-1.5 text-sm font-medium text-gray-900">
          {welcomePerson(new Date())}
        </p>
      </div>
      <div className="flex w-2/5 items-center justify-end gap-3">
        <Link href="/api/loggout">
          <button className="rounded-md bg-red-500 px-3 py-1 text-white">
            Deslogar
          </button>
        </Link>
        <Image src="/profile-icon.svg" alt="profile" width={35} height={35} />
      </div>
    </header>
  )
}
