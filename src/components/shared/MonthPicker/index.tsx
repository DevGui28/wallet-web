'use client'

import { CalendarBlank } from '@phosphor-icons/react'
import {
  add,
  eachMonthOfInterval,
  endOfYear,
  format,
  isEqual,
  parse,
  startOfMonth,
  startOfToday,
} from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import * as React from 'react'
import { useState } from 'react'
import { cn } from '../../../lib/utils'
import { Button, buttonVariants } from '../../ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover'

function getStartOfCurrentMonth() {
  return startOfMonth(startOfToday())
}

interface MonthPickerProps {
  currentMonth: Date
  onMonthChange: (newMonth: Date) => void
}

export default function MonthPicker(props: MonthPickerProps) {
  const { currentMonth, onMonthChange } = props
  const [open, setOpen] = useState(false)

  const [currentYear, setCurrentYear] = React.useState(
    format(currentMonth, 'yyyy')
  )
  const firstDayCurrentYear = parse(currentYear, 'yyyy', new Date())

  const months = eachMonthOfInterval({
    start: firstDayCurrentYear,
    end: endOfYear(firstDayCurrentYear),
  })

  function previousYear() {
    const firstDayNextYear = add(firstDayCurrentYear, { years: -1 })
    setCurrentYear(format(firstDayNextYear, 'yyyy'))
  }

  function nextYear() {
    const firstDayNextYear = add(firstDayCurrentYear, { years: 1 })
    setCurrentYear(format(firstDayNextYear, 'yyyy'))
  }

  return (
    <Popover modal={true} open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          className="flex h-10 w-60 justify-between rounded-md border border-border bg-card text-sm text-foreground"
          variant="outline"
        >
          <div className="text-right">
            <div className="py-1">
              <p>{`${
                currentMonth.getUTCMonth() + 1
              }/${currentMonth.getFullYear()}`}</p>
            </div>
          </div>
          <div className="-mr-2 scale-125 pl-1 opacity-60">
            <CalendarBlank weight="bold" width={24} />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto bg-popover text-popover-foreground">
        <div className="p-3">
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <div className="space-y-4">
              <div className="relative flex items-center justify-center pt-1">
                <div
                  className="text-sm font-medium"
                  aria-live="polite"
                  role="presentation"
                  id="month-picker"
                >
                  {format(firstDayCurrentYear, 'yyyy')}
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    name="previous-year"
                    aria-label="Go to previous year"
                    className={cn(
                      buttonVariants({ variant: 'outline' }),
                      'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
                      'absolute left-1'
                    )}
                    type="button"
                    onClick={previousYear}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    name="next-year"
                    aria-label="Go to next year"
                    className={cn(
                      buttonVariants({ variant: 'outline' }),
                      'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
                      'absolute right-1 disabled:bg-muted'
                    )}
                    type="button"
                    onClick={nextYear}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div
                className="grid w-full grid-cols-3 gap-2"
                role="grid"
                aria-labelledby="month-picker"
              >
                {months.map((month) => (
                  <div
                    key={month.toString()}
                    className="relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-muted first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
                    role="presentation"
                  >
                    <button
                      name="day"
                      className={cn(
                        'inline-flex h-9 w-16 items-center justify-center rounded-md p-0 text-sm font-normal ring-offset-background transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 aria-selected:opacity-100',
                        isEqual(month, currentMonth) &&
                          'bg-accent text-accent-foreground',
                        !isEqual(month, currentMonth) &&
                          isEqual(month, getStartOfCurrentMonth()) &&
                          'bg-muted text-muted-foreground'
                      )}
                      role="gridcell"
                      tabIndex={-1}
                      type="button"
                      onClick={() => onMonthChange(month)}
                    >
                      <time dateTime={format(month, 'yyyy-MM-dd')}>
                        {format(month, 'MMM')}
                      </time>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
