/* eslint-disable @next/next/no-img-element */
'use client'

import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { ChartPie, Crown, SignOut } from '@phosphor-icons/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface MenuItem {
  id: string
  icon: React.ReactNode
  label: string
  notifications?: number | string
}

const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    icon: <ChartPie weight="fill" size={18} />,
    label: 'Painel',
  },
  // {
  //   id: 'transactions',
  //   icon: <ArrowsLeftRight weight="fill" size={18} />,
  //   label: 'Transações',
  // },
  // {
  //   id: 'installments',
  //   icon: <Stack weight="fill" size={18} />,
  //   label: 'Parcelamentos',
  // },
  // {
  //   id: 'bills',
  //   icon: <Receipt weight="fill" size={18} />,
  //   label: 'Contas e Boletos',
  // },
  // {
  //   id: 'credit-cards',
  //   icon: <Cardholder size={18} weight="fill" />,
  //   label: 'Cartões de Crédito',
  // },
  // {
  //   id: 'reports',
  //   icon: <ChartBar weight="fill" size={18} />,
  //   label: 'Relatórios',
  // },
  // {
  //   id: 'settings',
  //   icon: <Gear weight="fill" size={18} />,
  //   label: 'Configurações',
  // },
  {
    id: 'subscriptions',
    icon: <Crown size={18} weight="fill" />,
    label: 'Assinaturas',
  },
]

export function SideNav() {
  const pathname = usePathname()
  const pageName = pathname.split('/')[1]

  return (
    <div className="fixed left-0 top-0 flex h-full w-60 flex-col justify-between bg-background px-4 py-8">
      <div>
        <div className="my-8 flex items-center">
          <img alt="logo" src="/wallet-logo.png" className="mr-2 h-14" />
          <h1 className="inter-900 text-wrap text-2xl/6 text-card-foreground">
            Sábio Financeiro
          </h1>
        </div>
        <nav className="space-y-2 px-2 py-4">
          {menuItems.map((item: MenuItem) => (
            <>
              <Link
                href={`/${item.id}`}
                key={item.id}
                className={cn(
                  'group/item flex h-12 w-full items-center justify-between rounded-md bg-muted px-4 text-muted-foreground hover:bg-secondary hover:text-secondary-foreground',
                  {
                    'bg-secondary text-secondary-foreground':
                      pageName === item.id,
                  }
                )}
              >
                <span className="flex items-center gap-2 text-xs">
                  {item.icon}
                  <span>{item.label}</span>
                </span>
                {item.notifications && (
                  <span
                    className={cn(
                      'rounded-full bg-accent px-2 py-1 text-xs font-medium text-accent-foreground group-hover/item:bg-primary group-hover/item:text-primary-foreground',
                      {
                        'bg-primary text-primary-foreground group-hover/item:bg-primary group-hover/item:text-primary-foreground':
                          pageName === item.id,
                      }
                    )}
                  >
                    {item.notifications}
                  </span>
                )}
              </Link>
            </>
          ))}
          <Separator />
        </nav>
      </div>
      <div className="flex h-12 w-full cursor-pointer items-center justify-center rounded-md bg-muted text-muted-foreground hover:bg-secondary hover:text-secondary-foreground">
        <SignOut size={18} />
        <span className="text-xs">Sair</span>
      </div>
    </div>
  )
}
