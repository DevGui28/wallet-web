/* eslint-disable @next/next/no-img-element */
'use client'

import { Bell } from '@phosphor-icons/react'
import { Search } from 'lucide-react'

export default function TopNav({ title }: { title: string }) {
  const name = 'John Doe'
  const img = null
  // 'https://p2.trrsf.com/image/fget/cf/774/0/images.terra.com/2023/12/13/istock-1331962950-1iemnjv7a6ng6.jpg'
  return (
    <div className="flex w-full items-center justify-between bg-card p-8">
      <h1 className="inter-700 text-3xl">{title}</h1>
      <div className="flex items-center space-x-4">
        <Search size={20} />
        <Bell size={20} weight="fill" />

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
