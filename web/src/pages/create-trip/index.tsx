import { useAutoAnimate } from '@formkit/auto-animate/react'
import { useState } from 'react'
import { DateRange } from 'react-day-picker'
import { ConfirmTripModal } from './confirm-trip-modal'
import { InviteGuestsModal } from './invite-guests-modal'
import { DestinationAndDateStep } from './steps/destination-and-date-step'
import { InviteGuestsStep } from './steps/invite-guests-step'

export function CreateTripPage() {
  const [isGuestsInputOpen, setIsGuestsInputOpen] = useState(false)
  const [isGuestsModalOpen, setIsGuestsModalOpen] = useState(false)
  const [isConfirmTripModalOpen, setIsConfirmTripModalOpen] = useState(false)

  const [destination, setDestination] = useState('')
  const [eventStartAndEndDates, setEventStartAndEndDates] = useState<
    DateRange | undefined
  >()
  const [guests, setGuests] = useState<string[]>([])

  const [animationRef] = useAutoAnimate()

  function openGuestsInput() {
    setIsGuestsInputOpen(true)
  }

  function closeGuestsInput() {
    setIsGuestsInputOpen(false)
  }

  function openGuestsModal() {
    setIsGuestsModalOpen(true)
  }

  function closeGuestsModal() {
    setIsGuestsModalOpen(false)
  }

  function openConfirmTripModal() {
    setIsConfirmTripModalOpen(true)
  }

  function closeConfirmTripModal() {
    setIsConfirmTripModalOpen(false)
  }

  return (
    <main className="min-h-dvh flex items-center justify-center bg-pattern bg-contain bg-no-repeat bg-center">
      <div className="max-w-3xl px-6 space-y-10 w-full">
        <div className="space-y-3">
          <img src="/logo.svg" alt="plann.er" className="mx-auto" />
          <p className="text-zinc-300 text-lg text-center">
            Convide seus amigos e planeje sua próxima viagem!
          </p>
        </div>

        <div className="space-y-4" ref={animationRef}>
          <DestinationAndDateStep
            closeGuestsInput={closeGuestsInput}
            isGuestsInputOpen={isGuestsInputOpen}
            openGuestsInput={openGuestsInput}
            //
            date={eventStartAndEndDates}
            onSelectDate={setEventStartAndEndDates}
            destination={destination}
            onDestinationChange={setDestination}
          />

          {isGuestsInputOpen && (
            <InviteGuestsStep
              guests={guests}
              openConfirmTripModal={openConfirmTripModal}
              openGuestsModal={openGuestsModal}
            />
          )}
        </div>

        <p className="text-zinc-500 text-center text-sm max-w-md mx-auto">
          Ao planejar sua viagem pela plann.er você automaticamente concorda com
          nossos{' '}
          <a
            href="#"
            className="underline underline-offset-4 text-zinc-300 hover:text-zinc-100 transition-colors duration-200 ease-linear"
          >
            termos de uso
          </a>{' '}
          e{' '}
          <a
            href="#"
            className="underline underline-offset-4 text-zinc-300 hover:text-zinc-100 transition-colors duration-200 ease-linear"
          >
            políticas de privacidade
          </a>
          .
        </p>
      </div>

      {isGuestsModalOpen && (
        <InviteGuestsModal
          guests={guests}
          onGuestsChange={setGuests}
          closeGuestsModal={closeGuestsModal}
        />
      )}

      {isConfirmTripModalOpen && (
        <ConfirmTripModal
          closeConfirmTripModal={closeConfirmTripModal}
          //
          destination={destination}
          eventStartAndEndDates={eventStartAndEndDates}
          guests={guests}
        />
      )}
    </main>
  )
}
