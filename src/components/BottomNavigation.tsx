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
import { motion } from 'framer-motion'
import { useState } from 'react'

const addNewMap = [
  {
    title: 'Despesa',
  },
  {
    title: 'Salário',
  },
]

export default function BottomNavigation() {
  const [active, setActive] = useState('dashboard')

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed bottom-0 flex w-full items-center justify-around rounded-t-2xl bg-white p-3 text-gray-800 shadow-md"
    >
      <HomeIcon
        sx={{ fontSize: 30 }}
        className={clsx({
          'text-blue-600': active === 'dashboard',
        })}
        onClick={() => setActive('dashboard')}
      />
      <Popover>
        <PopoverTrigger>
          <AddCircleIcon
            sx={{ fontSize: 35 }}
            className={clsx({
              'text-blue-600': active === 'expenses',
            })}
            onClick={() => setActive('expenses')}
          />
        </PopoverTrigger>
        <PopoverContent className="mb-3 w-full">
          {addNewMap.map((item) => (
            <div
              key={item.title.toLowerCase().split(' ').join('-')}
              className="flex items-center justify-center p-2"
            >
              <AddIcon
                sx={{ color: item.title === 'Despesa' ? 'red' : 'blue' }}
                className="mr-2"
              />
              <p className="poppins-semibold text-sm">Adicionar {item.title}</p>
            </div>
          ))}
        </PopoverContent>
      </Popover>
      <PersonIcon
        sx={{ fontSize: 30 }}
        className={clsx({
          'text-blue-600': active === 'profile',
        })}
        onClick={() => setActive('profile')}
      />
    </motion.nav>
  )
}
