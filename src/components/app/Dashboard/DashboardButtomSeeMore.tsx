import { Button } from '../../ui/button'
import { ArrowRight } from '@phosphor-icons/react'
import Link from 'next/link'

interface DashboardButtomSeeMoreProps {
  link: string
  text?: string
}

export default function DashboardButtomSeeMore({
  link,
  text = 'Ver mais',
}: DashboardButtomSeeMoreProps) {
  return (
    <div className="flex justify-end">
      <Link href={link}>
        <Button variant="outline" size="sm" className="flex items-center">
          {text}
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </Link>
    </div>
  )
}
