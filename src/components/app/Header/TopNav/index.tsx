/* eslint-disable @next/next/no-img-element */
import { Bell } from '@phosphor-icons/react/dist/ssr'
import ChangeTheme from '../../../shared/ChangeTheme'

type Props = {
  title: string
  name: string
}

export default function TopNav({ title, name }: Props) {
  let img
  return (
    <div className="flex w-full items-center justify-between px-2 py-4 md:px-4 md:py-8">
      <h1 className="inter-700 mr-3 text-xl md:text-3xl">{title}</h1>
      <div className="flex items-center justify-center space-x-6">
        <div className="relative cursor-pointer">
          <Bell size={20} weight="fill" />
          <span className="absolute -right-3 -top-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
            +9
          </span>
        </div>
        <ChangeTheme />
        {img ? (
          <img
            src={img}
            alt="profile-image"
            className="hidden h-8 w-8 rounded-full border border-primary md:block"
          />
        ) : (
          <div className="hidden h-8 w-8 cursor-default items-center justify-center rounded-full border border-primary bg-primary font-bold text-primary-foreground md:flex">
            {name
              .split(' ')
              .map((n, i) => (i < 1 ? n[0].toUpperCase() : ''))
              .join('')}
          </div>
        )}
      </div>
    </div>
  )
}
