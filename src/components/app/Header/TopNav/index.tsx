/* eslint-disable @next/next/no-img-element */
'use client'

import { Bell, Moon, Sun } from '@phosphor-icons/react'
import { useTheme } from 'next-themes'

export default function TopNav({ title }: { title: string }) {
  const { theme, setTheme } = useTheme()
  const name = 'John Doe'
  let img

  return (
    <div className="flex w-full items-center justify-between p-8">
      <h1 className="inter-700 text-3xl">{title}</h1>
      <div className="flex items-center justify-center space-x-4">
        <Bell size={20} weight="fill" />
        <button
          className="cursor-pointer"
          onClick={() =>
            setTheme((theme) => (theme === 'dark' ? 'light' : 'dark'))
          }
        >
          {theme === 'dark' ? (
            <Sun weight="fill" size={20} />
          ) : (
            <Moon weight="fill" size={20} />
          )}
        </button>
        {img ? (
          <img src={img} alt="profile-image" className="h-8 w-8 rounded-full" />
        ) : (
          <div className="flex h-8 w-8 cursor-default items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">
            {name
              .split(' ')
              .map((n) => n[0].toUpperCase())
              .join('')}
          </div>
        )}
      </div>
    </div>
  )
}
