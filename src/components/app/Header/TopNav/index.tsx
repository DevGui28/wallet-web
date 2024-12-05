/* eslint-disable @next/next/no-img-element */

import ChangeTheme from '@/components/shared/ChangeTheme'
import { Bell } from '@phosphor-icons/react'

export default function TopNav({ title }: { title: string }) {
  const name = 'John Doe'
  // biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
  let img

  return (
    <div className="flex w-full items-center justify-between p-8">
      <h1 className="inter-700 text-3xl">{title}</h1>
      <div className="flex items-center justify-center space-x-6">
        {/* <div className="flex items-center justify-center gap-4 rounded-full bg-secondary px-5 py-3 text-secondary-foreground">
          <Plus size={20} className="text-primary" />
          Adicionar transação
        </div> */}
        <div className="relative cursor-pointer">
          <Bell size={20} weight="fill" />
          <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
            3
          </span>
        </div>
        <ChangeTheme />
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
