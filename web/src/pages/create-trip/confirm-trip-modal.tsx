import { Mail, User, X } from 'lucide-react'
import { ElementRef, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useOnClickOutside } from 'usehooks-ts'
import { Button } from '../../components/button'

type Props = {
  guests: string[]
  closeConfirmTripModal: () => void
}

export function ConfirmTripModal({ closeConfirmTripModal, guests }: Props) {
  const navigate = useNavigate()
  const confirmTripModalRef = useRef<ElementRef<'div'>>(null)

  function createTrip(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string | null
    const email = formData.get('email') as string | null

    if (!name || !email) {
      return
    }

    console.log({ name, email, guests })

    navigate('/trips/123')
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
            <span className="text-zinc-100 font-semibold">
              Florianópolis, Brasil
            </span>{' '}
            nas datas de{' '}
            <span className="text-zinc-100 font-semibold">
              16 a 27 de Agosto de 2024
            </span>{' '}
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
