'use client'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import AddIcon from '@mui/icons-material/Add'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import HomeIcon from '@mui/icons-material/Home'
import PersonIcon from '@mui/icons-material/Person'
import clsx from 'clsx'
import Link from 'next/link'
import { useState } from 'react'

const addNewMap = [
  {
    title: 'Despesa',
    link: '/new/expenses',
  },
  {
    title: 'Salário',
    link: '/new/salaries',
  },
]

export default function BottomNavigation() {
  const [active, setActive] = useState('dashboard')

  return (
    <nav className="fixed bottom-0 flex w-full items-center justify-around rounded-t-2xl bg-white p-3 text-gray-400 shadow-md">
      <Link href="/dashboard">
        <HomeIcon
          sx={{ fontSize: 30 }}
          className={clsx('cursor-pointer', {
            'text-gray-600': active === 'dashboard',
          })}
          onClick={() => setActive('dashboard')}
        />
      </Link>
      <Popover>
        <PopoverTrigger>
          <AddCircleIcon sx={{ fontSize: 35 }} className="text-blue-600" />
        </PopoverTrigger>
        <PopoverContent className="mb-3 w-full">
          {addNewMap.map((item) => (
            <Link
              href={item.link}
              key={item.title.toLowerCase().split(' ').join('-')}
              className="flex items-center justify-around p-2"
            >
              <AddIcon
                sx={{ color: item.title === 'Despesa' ? 'red' : 'blue' }}
                className="mr-2"
              />
              <p className="poppins-semibold text-sm">Adicionar {item.title}</p>
            </Link>
          ))}
        </PopoverContent>
      </Popover>
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
