'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

export function Header() {
  const { theme, setTheme } = useTheme()
  return (
    <header className="flex h-10 max-h-96 w-full items-center justify-between p-4">
      <a href="/" className="text-lg font-bold text-foreground">
        My App
      </a>
      <nav className="flex items-center gap-4">
        <a href="/about" className="mx-2 text-foreground">
          About
        </a>
        <a href="/contact" className="mx-2 text-foreground">
          Contact
        </a>
        <button
          className="text-foreground"
          onClick={() =>
            setTheme((theme) => (theme === 'dark' ? 'light' : 'dark'))
          }
        >
          {theme === 'dark' ? <Sun /> : <Moon />}
        </button>
      </nav>
    </header>
  )
}
