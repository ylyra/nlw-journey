import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Mail, User, X } from 'lucide-react'
import { ElementRef, useMemo, useRef } from 'react'
import type { DateRange } from 'react-day-picker'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useOnClickOutside } from 'usehooks-ts'
import { Button } from '../../components/button'
import { api } from '../../lib/axios'

type Props = {
  destination: string
  eventStartAndEndDates: DateRange | undefined
  guests: string[]
  closeConfirmTripModal: () => void
}

export function ConfirmTripModal({
  closeConfirmTripModal,
  guests,
  destination,
  eventStartAndEndDates,
}: Props) {
  const navigate = useNavigate()
  const confirmTripModalRef = useRef<ElementRef<'div'>>(null)
  const displayedDate = useMemo(() => {
    if (!eventStartAndEndDates) return null

    let dateFormatted = ''

    if (eventStartAndEndDates.from) {
      dateFormatted = format(eventStartAndEndDates.from, "d' de 'LLL", {
        locale: ptBR,
      })
    }

    if (eventStartAndEndDates.to) {
      dateFormatted += ` até ${format(eventStartAndEndDates.to, "d' de 'LLL", { locale: ptBR })}`
    }

    return dateFormatted
  }, [eventStartAndEndDates])

  function createTrip(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string | null
    const email = formData.get('email') as string | null

    if (
      !name ||
      !email ||
      !guests.length ||
      !destination ||
      !eventStartAndEndDates ||
      !eventStartAndEndDates.from ||
      !eventStartAndEndDates.to
    ) {
      toast.error('Preencha todos os campos para continuar')
      return
    }

    try {
      toast.promise(
        async () => {
          const response = await api.post<{
            tripId: string
          }>('/trips', {
            destination,
            starts_at: eventStartAndEndDates.from,
            ends_at: eventStartAndEndDates.to,
            emails_to_invite: guests,
            owner_name: name,
            owner_email: email,
          })

          navigate(`/trips/${response.data.tripId}`)
        },
        {
          loading: 'Criando viagem...',
          success: 'Viagem criada com sucesso!',
          error: 'Ocorreu um erro ao criar a viagem',
        },
      )
    } catch (error) {}
  }

  useOnClickOutside(confirmTripModalRef, closeConfirmTripModal)

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
      <div
        className="max-w-[640px] w-full rounded-xl py-5 px-6 bg-zinc-900 shadow-shape space-y-5"
        ref={confirmTripModalRef}
      >
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-bold text-lg ">Confirmar criação da viagem</h2>
            <button
              type="button"
              onClick={closeConfirmTripModal}
              className="text-zinc-400"
            >
              <X className="size-5" />
            </button>
          </div>

          <p className="text-sm text-zinc-400">
            Para concluir a criação da viagem para{' '}
            <span className="text-zinc-100 font-semibold">{destination}</span>{' '}
            nas datas de{' '}
            <span className="text-zinc-100 font-semibold">{displayedDate}</span>{' '}
            preencha seus dados abaixo:
          </p>
        </div>

        <form className="space-y-2" onSubmit={createTrip}>
          <div className="bg-zinc-950 border border-zinc-800 p-4 flex items-center gap-2 rounded-xl">
            <User className="size-5 text-zinc-400 shrink-0" />
            <input
              type="text"
              name="name"
              className="bg-transparent outline-none placeholder:text-zinc-400 flex-1"
              placeholder="Seu nome completo"
            />
          </div>

          <div className="bg-zinc-950 border border-zinc-800 p-4 flex items-center gap-2 rounded-xl">
            <Mail className="size-5 text-zinc-400 shrink-0" />
            <input
              type="email"
              name="email"
              className="bg-transparent outline-none placeholder:text-zinc-400 flex-1"
              placeholder="Seu e-mail pessoal"
            />
          </div>

          <Button className="!mt-3" size="full">
            Confirmar criação da viagem
          </Button>
        </form>
      </div>
    </div>
  )
}
