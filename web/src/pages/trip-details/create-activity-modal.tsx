import { Calendar, Tag, X } from 'lucide-react'
import { useRef, type ElementRef } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { useOnClickOutside } from 'usehooks-ts'
import { Button } from '../../components/button'
import { api } from '../../lib/axios'

type Props = {
  closeCreateActivityModal: () => void
}

export function CreateActivityModal({ closeCreateActivityModal }: Props) {
  const params = useParams<{
    tripId: string
  }>()
  const createActivityModalRef = useRef<ElementRef<'div'>>(null)

  function createActivity(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    const title = formData.get('title') as string
    const occursAt = formData.get('occurs_at') as string

    if (!title || !occursAt) {
      toast.error('Preencha todos os campos')

      return
    }

    try {
      toast.promise(
        async () => {
          await api.post(`/trips/${params.tripId}/activities`, {
            title,
            occurs_at: occursAt,
          })

          event.currentTarget.reset()

          window.location.reload()
        },
        {
          loading: 'Salvando atividade...',
          success: 'Atividade salva com sucesso',
          error: 'Ocorreu um erro ao salvar a atividade',
        },
      )
    } catch (error) {}
  }

  useOnClickOutside(createActivityModalRef, closeCreateActivityModal)

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
      <div
        className="max-w-[640px] w-full rounded-xl py-5 px-6 bg-zinc-900 shadow-shape space-y-5"
        ref={createActivityModalRef}
      >
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-bold text-lg ">Cadastrar atividade</h2>
            <button
              type="button"
              onClick={closeCreateActivityModal}
              className="text-zinc-400"
            >
              <X className="size-5" />
            </button>
          </div>

          <p className="text-sm text-zinc-400">
            Todos convidados podem visualizar as atividades.
          </p>
        </div>

        <form className="space-y-2" onSubmit={createActivity}>
          <div className="bg-zinc-950 border border-zinc-800 p-4 flex items-center gap-2 rounded-xl">
            <Tag className="size-5 text-zinc-400 shrink-0" />
            <input
              type="text"
              name="title"
              className="bg-transparent outline-none placeholder:text-zinc-400 flex-1"
              placeholder="Seu nome completo"
            />
          </div>

          <div className="bg-zinc-950 border border-zinc-800 p-4 flex items-center gap-2 rounded-xl flex-1">
            <Calendar className="size-5 text-zinc-400 shrink-0" />
            <input
              type="datetime-local"
              name="occurs_at"
              className="bg-transparent outline-none placeholder:text-zinc-400 flex-1"
              placeholder="Data e horário da atividade"
            />
          </div>

          <Button className="!mt-3" size="full">
            Salvar atividade
          </Button>
        </form>
      </div>
    </div>
  )
}
