import Image from 'next/image'

export default function Header() {
  return (
    <header className="flex h-[70px] flex-col justify-center bg-[#15d1d1]">
      <Image src="/wallet-logo.png" alt="Logo" width={350} height={71} />
    </header>
  )
}
