'use client'

import Link from 'next/link'
import { useState } from 'react'
import { cn } from '../../../../lib/utils'
import { menuItems } from '../SideNav'

type Props = {
  className?: string
}

export function MobileNav({ className }: Props) {
  const [isOpen, setIsOpen] = useState(false)
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
        {isOpen &&
          menuItems.map((item) => (
            <Link
              href={`/${item.link}`}
              key={item.link}
              className="rounded-md bg-secondary p-1 text-center text-secondary-foreground hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
      </div>
    </nav>
  )
}
