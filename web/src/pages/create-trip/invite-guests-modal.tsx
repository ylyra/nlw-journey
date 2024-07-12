import { AtSign, Plus, X } from 'lucide-react'
import { ElementRef, useRef } from 'react'
import { useOnClickOutside } from 'usehooks-ts'
import { Button } from '../../components/button'

type Props = {
  guests: string[]
  onGuestsChange: (guests: string[]) => void
  closeGuestsModal: () => void
}

export function InviteGuestsModal({
  closeGuestsModal,
  guests,
  onGuestsChange,
}: Props) {
  const guestsModalRef = useRef<ElementRef<'div'>>(null)

  function addNewEmailToInvite(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string | null

    if (!email || guests.includes(email)) {
      return
    }

    onGuestsChange([...guests, email])

    // clear form
    e.currentTarget.reset()
  }

  function removeEmailToInvite(email: string) {
    onGuestsChange(guests.filter((guest) => guest !== email))
  }

  useOnClickOutside(guestsModalRef, closeGuestsModal)
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
      <div
        className="max-w-[640px] w-full rounded-xl py-5 px-6 bg-zinc-900 shadow-shape space-y-5"
        ref={guestsModalRef}
      >
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-bold text-lg ">Selecionar convidados</h2>
            <button
              type="button"
              onClick={closeGuestsModal}
              className="text-zinc-400"
            >
              <X className="size-5" />
            </button>
          </div>
          <p className="text-sm text-zinc-400">
            Os convidados irão receber e-mails para confirmar a participação na
            viagem.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {guests.map((guest) => (
            <div
              className="px-2.5 py-1.5 bg-zinc-800 rounded-md flex items-center gap-2.5"
              key={guest}
            >
              <span className="text-zinc-300">{guest}</span>
              <button
                type="button"
                className="text-zinc-400"
                onClick={() => removeEmailToInvite(guest)}
              >
                <X className="size-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="h-px bg-zinc-800" />

        <form
          className="bg-zinc-950 border border-zinc-800 p-2.5 flex items-center gap-2 rounded-xl"
          onSubmit={addNewEmailToInvite}
        >
          <div className="flex items-center gap-2 flex-1">
            <AtSign className="size-5 text-zinc-400 shrink-0" />
            <input
              type="email"
              name="email"
              className="bg-transparent outline-none placeholder:text-zinc-400"
              placeholder="Digite o e-mail do convidado"
            />
          </div>

          <Button>
            Convidar <Plus className="size-5 shrink-0" />
          </Button>
        </form>
      </div>
    </div>
  )
}
