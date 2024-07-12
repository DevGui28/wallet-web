import Image from 'next/image'

export default function Header() {
  return (
    <header className="flex h-20 w-screen flex-col items-center justify-center bg-blue-600">
      <Image src="/wallet-logo.png" alt="Logo" width={350} height={71} />
    </header>
  )
}
