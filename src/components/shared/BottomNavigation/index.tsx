'use client'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { withAuth } from '@/lib/with-auth'
import AddIcon from '@mui/icons-material/Add'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import InsightsIcon from '@mui/icons-material/Insights'
import LeaderboardIcon from '@mui/icons-material/Leaderboard'
import PaidIcon from '@mui/icons-material/Paid'
import PersonIcon from '@mui/icons-material/Person'
import clsx from 'clsx'
import Link from 'next/link'
import { useState } from 'react'

const addNewMap = [
  {
    title: 'Despesa',
    link: '/new/expense',
  },
  {
    title: 'Salário',
    link: '/new/salary',
  },
]

const viewMap = [
  {
    title: 'Despesa',
    link: '/view/expenses',
  },
  {
    title: 'Salário',
    link: '/view/salaries',
  },
]

function BottomNavigation() {
  const [active, setActive] = useState('dashboard')

  return (
    <nav className="fixed bottom-0 flex w-full items-center justify-around rounded-t-2xl bg-white p-3 text-gray-400 shadow-md">
      <Link href="/dashboard">
        <LeaderboardIcon
          sx={{ fontSize: 30 }}
          className={clsx('cursor-pointer', {
            'text-gray-600': active === 'dashboard',
          })}
          onClick={() => setActive('dashboard')}
        />
      </Link>
      <Popover>
        <PopoverTrigger>
          <AttachMoneyIcon sx={{ fontSize: 35 }} className="text-green-700" />
        </PopoverTrigger>
        <PopoverContent className="mb-3 w-full">
          {viewMap.map((item) => (
            <Link
              href={item.link}
              key={item.title.toLowerCase().split(' ').join('-')}
              className="flex items-center justify-start p-3"
            >
              <PaidIcon
                sx={{ color: item.title === 'Despesa' ? 'red' : 'green' }}
                className="mr-2"
              />
              <p className="poppins-semibold text-sm">
                {item.title === 'Salário'
                  ? 'Ver meus salários'
                  : 'Ver minhas despesas'}
              </p>
            </Link>
          ))}
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger>
          <AddCircleIcon sx={{ fontSize: 35 }} className="text-blue-600" />
        </PopoverTrigger>
        <PopoverContent className="mb-3 w-full">
          {addNewMap.map((item) => (
            <Link
              href={item.link}
              key={item.title.toLowerCase().split(' ').join('-')}
              className="flex items-center justify-start p-3"
            >
              <AddIcon
                sx={{ color: item.title === 'Despesa' ? 'red' : 'green' }}
                className="mr-2"
              />
              <p className="poppins-semibold text-sm">Adicionar {item.title}</p>
            </Link>
          ))}
        </PopoverContent>
      </Popover>
      <Link href="/insights">
        <InsightsIcon
          sx={{ fontSize: 30 }}
          className={clsx({
            'text-gray-600': active === 'insights',
          })}
          onClick={() => setActive('insights')}
        />
      </Link>
      <Link href="/profile">
        <PersonIcon
          sx={{ fontSize: 30 }}
          className={clsx({
            'text-gray-600': active === 'profile',
          })}
          onClick={() => setActive('profile')}
        />
      </Link>
    </nav>
  )
}

export default withAuth(BottomNavigation)
