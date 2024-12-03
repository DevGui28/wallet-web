'use client'

import { cn } from '@/lib/utils'
import {
  ArrowsLeftRight,
  CreditCard,
  House,
  Moon,
  Sun,
} from '@phosphor-icons/react'
import { useTheme } from 'next-themes'
import { useState } from 'react'

interface MenuItem {
  id: string
  icon: React.ReactNode
  label: string
  notifications?: number | string
}

const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    icon: <House weight="fill" size={25} />,
    label: 'Painel',
  },
  {
    id: 'transactions',
    icon: <ArrowsLeftRight weight="fill" size={25} />,
    label: 'Transações',
  },
  {
    id: 'credit-cards',
    icon: <CreditCard size={25} weight="fill" />,
    label: 'Cartões de Crédito',
  },
]

export function SideNav() {
  const [activeItem, setActiveItem] = useState('dashboard')
  const { setTheme, theme } = useTheme()
  return (
    <div className="fixed left-0 top-0 flex h-full w-80 flex-col bg-background px-4 py-4">
      <nav className="space-y-2 px-2 py-4">
        {menuItems.map((item: MenuItem) => (
          <button
            key={item.id}
            onClick={() => setActiveItem(item.id)}
            className={cn(
              'group/item flex h-12 w-full items-center justify-between rounded-md px-4 hover:bg-secondary hover:text-secondary-foreground',
              {
                'bg-secondary text-secondary-foreground':
                  activeItem === item.id,
              }
            )}
          >
            <span className="flex items-center gap-2 text-sm">
              {item.icon}
              <span>{item.label}</span>
            </span>
            {item.notifications && (
              <span
                className={cn(
                  'rounded-full bg-accent px-2 py-1 text-xs font-medium text-accent-foreground group-hover/item:bg-primary group-hover/item:text-primary-foreground',
                  {
                    'bg-primary text-primary-foreground group-hover/item:bg-primary group-hover/item:text-primary-foreground':
                      activeItem === item.id,
                  }
                )}
              >
                {item.notifications}
              </span>
            )}
          </button>
        ))}

        <button
          onClick={() =>
            setTheme((theme) => (theme === 'dark' ? 'light' : 'dark'))
          }
          className={cn(
            'flex h-12 w-full items-center justify-between rounded-md pl-4 pr-10 hover:bg-secondary hover:text-secondary-foreground'
          )}
        >
          <span className="flex items-center gap-2">
            {theme === 'dark' ? (
              <Sun weight="fill" size={25} />
            ) : (
              <Moon weight="fill" size={25} />
            )}
            {theme === 'dark' ? 'Light' : 'Dark'} Mode
          </span>
        </button>
      </nav>
    </div>
  )
}
