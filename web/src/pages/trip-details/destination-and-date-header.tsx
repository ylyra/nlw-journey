import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { MapPin, Settings2 } from 'lucide-react'
import { useMemo } from 'react'
import type { Trip } from '../../@types/trip'
import { Button } from '../../components/button'

type Props = {
  trip: Trip
}

export function DestinationAndDateHeader({ trip }: Props) {
  const displayedDate = useMemo(() => {
    let dateFormatted = ''

    if (trip.starts_at) {
      dateFormatted = format(trip.starts_at, "d' de 'LLL", {
        locale: ptBR,
      })
    }

    if (trip.ends_at) {
      dateFormatted += ` até ${format(trip.ends_at, "d' de 'LLL", { locale: ptBR })}`
    }

    return dateFormatted
  }, [trip])

  return (
    <header className="px-4 h-16 rounded-xl bg-zinc-900 shadow-shape flex items-center justify-between">
      <div className="flex items-center gap-2">
        <MapPin className="size-5 text-zinc-400" />
        <strong className="text-zinc-100 font-normal">
          {trip.destination}
        </strong>
      </div>

      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2">
          <MapPin className="size-5 text-zinc-400" />
          <span className="text-zinc-100 font-normal">{displayedDate}</span>
        </div>

        <div className="w-px h-6 bg-zinc-800" />

        <Button variant="secondary">
          Alterar local/data <Settings2 className="size-5" />
        </Button>
      </div>
    </header>
  )
}
