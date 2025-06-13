'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { cn } from '../../../../lib/utils'
import { useAuth } from '../../../../hooks/useAuth'
import { menuItems } from '../SideNav'
import { SignOut } from '@phosphor-icons/react'

type Props = {
  className?: string
}

export function MobileNav({ className }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const { logout } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }

  return (
    <nav
      className={cn(
        'flex min-h-6 flex-col items-end gap-4 md:hidden',
        className
      )}
    >
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex h-5 w-8 cursor-pointer flex-col justify-between"
      >
        <div
          className={cn(
            'h-1 rounded bg-foreground transition-transform duration-300',
            isOpen && 'translate-y-2 rotate-45'
          )}
        />
        <div
          className={cn(
            'h-1 rounded bg-foreground transition-opacity duration-300',
            isOpen && 'opacity-0'
          )}
        />
        <div
          className={cn(
            'h-1 rounded bg-foreground transition-transform duration-300',
            isOpen && '-translate-y-2 -rotate-45'
          )}
        />
      </div>
      <div className="flex w-full flex-col gap-1">
        {isOpen && (
          <>
            {menuItems.map((item) => (
              <Link
                href={`/${item.link}`}
                key={item.link}
                className="rounded-md bg-secondary p-1 px-4 text-center text-secondary-foreground hover:bg-primary/20 hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="mt-2 flex items-center justify-center gap-2 rounded-md bg-secondary p-1 px-4 text-center text-secondary-foreground hover:bg-destructive/20 hover:text-destructive"
            >
              <SignOut size={16} weight="bold" />
              Sair
            </button>
          </>
        )}
      </div>
    </nav>
  )
}
