'use client'

import { cn } from '@/lib/utils'
import { Moon, Sun } from '@phosphor-icons/react'
import { useTheme } from 'next-themes'

export default function ChangeTheme({
  className,
  withText,
  textClass,
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
        'flex cursor-pointer items-center justify-center gap-2',
        className
      )}
      onClick={() => setTheme((theme) => (theme === 'dark' ? 'light' : 'dark'))}
    >
      {theme === 'dark' ? (
        <>
          <Sun weight="fill" size={20} />
          {withText && (
            <span className={cn('font-medium', textClass)}>Claro</span>
          )}
        </>
      ) : (
        <>
          <Moon weight="fill" size={20} />
          {withText && (
            <span className={cn('font-medium', textClass)}>Escuro</span>
          )}
        </>
      )}
    </button>
  )
}
