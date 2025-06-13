'use client'

import { cn } from '@/lib/utils'
import {
  ChartLine,
  ClipboardText,
  CreditCard,
  Crown,
  CurrencyDollar,
  PiggyBank,
  Receipt,
  SignOut,
  Target,
} from '@phosphor-icons/react'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '../../../../hooks/useAuth'

interface MenuItem {
  link: string
  icon: React.ReactNode
  label: string
}

export const menuItems: MenuItem[] = [
  {
    link: 'dashboard',
    icon: <ChartLine weight="fill" size={18} />,
    label: 'Dashboard',
  },
  {
    link: 'transactions',
    icon: <CurrencyDollar weight="fill" size={18} />,
    label: 'Transações',
  },
  {
    link: 'budgets',
    icon: <PiggyBank size={18} weight="fill" />,
    label: 'Orçamentos',
  },
  {
    link: 'payables',
    icon: <ClipboardText weight="fill" size={18} />,
    label: 'Contas a pagar',
  },
  {
    link: 'goals',
    icon: <Target weight="fill" size={18} />,
    label: 'Metas',
  },
  {
    link: 'credit-card',
    icon: <CreditCard size={18} weight="fill" />,
    label: 'Cartões de Crédito',
  },
  {
    link: 'invoices',
    icon: <Receipt size={18} weight="fill" />,
    label: 'Faturas',
  },
  {
    link: 'plans',
    icon: <Crown size={18} weight="fill" />,
    label: 'Planos',
  },
  // {
  //   link: 'reports',
  //   icon: <FileText weight="fill" size={18} />,
  //   label: 'Relatórios',
  // },
  // {
  //   link: 'settings',
  //   icon: <Gear weight="fill" size={18} />,
  //   label: 'Configurações',
  // },
]

type Props = {
  className?: string
}

export function SideNav({ className }: Props) {
  const pathname = usePathname()
  const pageName = pathname.split('/')[1]
  const { theme } = useTheme()
  const { logout } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }

  return (
    <div
      className={cn(
        'fixed left-5 top-5 flex h-[calc(100%-40px)] w-64 flex-col justify-between rounded-3xl bg-card px-4 py-8',
        className
      )}
    >
      <div>
        <div className="my-8 flex items-center justify-center">
          <Image
            alt="logo"
            src={`/sabio-financeiro-${theme === 'dark' ? 'dark' : 'light'}.png`}
            width={220}
            height={40}
          />
        </div>
        <nav className="space-y-2 px-2 py-4">
          {menuItems.map((item: MenuItem) => (
            <Link
              href={`/${item.link}`}
              key={item.link}
              className={cn(
                'group/item flex h-12 w-full items-center justify-between rounded-md bg-secondary px-4 text-secondary-foreground hover:border hover:border-primary hover:bg-primary/20 hover:text-primary',
                {
                  'border border-primary bg-primary/20 text-primary':
                    pageName === item.link,
                }
              )}
            >
              <span className="flex items-center gap-4 text-xs font-semibold">
                {item.icon}
                <span>{item.label}</span>
              </span>
            </Link>
          ))}
        </nav>
      </div>
      <button
        onClick={handleLogout}
        className="text-background-foreground flex h-12 w-full cursor-pointer items-center justify-center gap-5 rounded-md bg-background font-semibold hover:border hover:border-destructive hover:bg-destructive/40 hover:text-destructive"
      >
        <SignOut size={18} weight="bold" />
        <span className="text-xs">Sair</span>
      </button>
    </div>
  )
}
