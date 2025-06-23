'use client'

import { cn } from '@/lib/utils'
import { Moon, Sun } from '@phosphor-icons/react'
import { useTheme } from 'next-themes'

export default function ChangeTheme({
  className,
}: {
  className?: string
  withText?: boolean
  textClass?: string
}) {
  const { theme, setTheme } = useTheme()
  return (
    <button
      type="button"
      className={cn(
        'flex h-full cursor-pointer items-center justify-center gap-2',
        className
      )}
      onClick={() => setTheme((theme) => (theme === 'dark' ? 'light' : 'dark'))}
    >
      {theme === 'dark' ? (
        <Sun weight="fill" size={20} />
      ) : (
        <Moon weight="fill" size={20} />
      )}
    </button>
  )
}
