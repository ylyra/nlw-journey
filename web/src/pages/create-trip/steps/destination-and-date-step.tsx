import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  ArrowRight,
  Calendar as CalendarIcon,
  MapPin,
  Settings2,
} from 'lucide-react'
import { useMemo } from 'react'
import type { DateRange } from 'react-day-picker'
import { cn } from 'tailwind-variants'
import { Button } from '../../../components/button'
import { Calendar } from '../../../components/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../../components/popover'

type Props = {
  isGuestsInputOpen: boolean
  openGuestsInput: () => void
  closeGuestsInput: () => void
  date: DateRange | undefined
  onSelectDate: (date: DateRange | undefined) => void

  destination: string
  onDestinationChange: (destination: string) => void
}

export function DestinationAndDateStep({
  closeGuestsInput,
  isGuestsInputOpen,
  openGuestsInput,

  date,
  onSelectDate,
  destination,
  onDestinationChange,
}: Props) {
  const displayedDate = useMemo(() => {
    if (!date) return null

    let dateFormatted = ''

    if (date.from) {
      dateFormatted = format(date.from, "d' de 'LLL", { locale: ptBR })
    }

    if (date.to) {
      dateFormatted += ` até ${format(date.to, "d' de 'LLL", { locale: ptBR })}`
    }

    return dateFormatted
  }, [date])

  return (
    <div className="h-16 px-4 bg-zinc-900 rounded-xl flex items-center gap-5 shadow-shape">
      <div className="flex-1 flex items-center gap-2">
        <MapPin className="size-5 text-zinc-400 shrink-0" />
        <input
          type="text"
          className="bg-transparent outline-none text-lg placeholder:text-zinc-400 flex-1"
          placeholder="Para onde você vai?"
          disabled={isGuestsInputOpen}
          value={destination}
          onChange={(event) => onDestinationChange(event.target.value)}
        />
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <button
            className={cn(
              'justify-start text-left font-normal flex items-center gap-2 p-0',
              !date && 'text-zinc-400',
            )({
              twMerge: true,
            })}
          >
            <CalendarIcon className="size-5 text-zinc-400 shrink-0" />

            {displayedDate ?? 'Quando'}
          </button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            selected={date}
            onSelect={(value) => onSelectDate(value)}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <div className="w-px h-6 bg-zinc-800" />

      {isGuestsInputOpen ? (
        <Button onClick={closeGuestsInput} variant="secondary" type="button">
          Alterar local/data
          <Settings2 className="size-5 shrink-0" />
        </Button>
      ) : (
        <Button onClick={openGuestsInput} type="button">
          Continuar
          <ArrowRight className="size-5 shrink-0" />
        </Button>
      )}
    </div>
  )
}
