import { ArrowRight, UserRoundPlus } from 'lucide-react'
import { Button } from '../../../components/button'

type Props = {
  openGuestsModal: () => void
  openConfirmTripModal: () => void
  guests: string[]
}

export function InviteGuestsStep({
  guests,
  openConfirmTripModal,
  openGuestsModal,
}: Props) {
  return (
    <div className="h-16 px-4 bg-zinc-900 rounded-xl flex items-center gap-5 shadow-shape">
      <button
        type="button"
        onClick={openGuestsModal}
        className="flex-1 flex items-center gap-2 text-left"
      >
        <UserRoundPlus className="size-5 text-zinc-400 shrink-0" />
        {guests.length === 0 ? (
          <span className="text-lg text-zinc-400 flex-1">
            Quem estará na viagem?
          </span>
        ) : (
          <span className="text-lg text-zinc-100 flex-1">
            {guests.length} pessoa(s) convidada(s)
          </span>
        )}
      </button>

      <div className="w-px h-6 bg-zinc-800" />

      <Button
        onClick={openConfirmTripModal}
        disabled={guests.length === 0}
        type="button"
      >
        Confirmar viagem
        <ArrowRight className="size-5 shrink-0" />
      </Button>
    </div>
  )
}
