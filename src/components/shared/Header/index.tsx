import { welcomePerson } from '@/lib/useful'
import { withAuth } from '@/lib/with-auth'
import Image from 'next/image'
import Link from 'next/link'

function Header() {
  return (
    <header className="max-w-screen flex h-20 items-center justify-center gap-5 bg-blue-600">
      <div className="flex flex-col">
        <h1 className="poppins-bold text-gray-900">
          Ei, Bem vindo(a) devolta!
        </h1>
        <p className="-mt-1.5 text-sm font-medium text-gray-900">
          {welcomePerson(new Date())}
        </p>
      </div>
      <div className="flex items-center justify-end gap-3">
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

export default withAuth(Header)
