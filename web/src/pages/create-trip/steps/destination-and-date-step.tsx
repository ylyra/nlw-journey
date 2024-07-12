import { ArrowRight, Calendar, MapPin, Settings2 } from 'lucide-react'
import { Button } from '../../../components/button'

type Props = {
  isGuestsInputOpen: boolean
  openGuestsInput: () => void
  closeGuestsInput: () => void
}

export function DestinationAndDateStep({
  closeGuestsInput,
  isGuestsInputOpen,
  openGuestsInput,
}: Props) {
  return (
    <div className="h-16 px-4 bg-zinc-900 rounded-xl flex items-center gap-5 shadow-shape">
      <div className="flex-1 flex items-center gap-2">
        <MapPin className="size-5 text-zinc-400 shrink-0" />
        <input
          type="text"
          className="bg-transparent outline-none text-lg placeholder:text-zinc-400 flex-1"
          placeholder="Para onde você vai?"
          disabled={isGuestsInputOpen}
        />
      </div>

      <div className="flex items-center gap-2 max-w-28">
        <Calendar className="size-5 text-zinc-400 shrink-0" />
        <input
          type="text"
          className="bg-transparent outline-none text-lg placeholder:text-zinc-400"
          placeholder="Quando?"
          disabled={isGuestsInputOpen}
        />
      </div>

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
