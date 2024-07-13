import { CheckCircle2, CircleDashed, UserCog } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button } from '../../components/button'
import { api } from '../../lib/axios'

type Participant = {
  id: string
  name: string | null
  email: string
  is_confirmed: boolean
}

export function Guests() {
  const params = useParams<{
    tripId: string
  }>()
  const [participants, setParticipants] = useState<Participant[]>([])

  useEffect(() => {
    async function loadTrip() {
      try {
        const response = await api.get<{
          participants: Participant[]
        }>(`/trips/${params.tripId}/participants`)

        setParticipants(response.data.participants)
      } catch (error) {}
    }

    loadTrip()
  }, [params.tripId])

  return (
    <div className="space-y-6">
      <h2 className="font-semibold text-xl">Convidados</h2>

      <div className="space-y-5">
        {participants.map((item, idx) => (
          <div
            className="flex items-center justify-between gap-4"
            key={item.id}
          >
            <div className="space-y-1.5 max-w-60">
              <span className="block font-medium text-zinc-100">
                {item.name ?? `Convidado ${idx + 1}`}
              </span>
              <span className="block text-xs text-zinc-400 truncate">
                {item.email}
              </span>
            </div>

            {item.is_confirmed ? (
              <CheckCircle2 className="shrink-0 size-5 text-lime-300" />
            ) : (
              <CircleDashed className="shrink-0 size-5 text-zinc-400" />
            )}
          </div>
        ))}
      </div>

      <Button variant="secondary" size="full">
        <UserCog className="size-5" /> Gerenciar convidados
      </Button>
    </div>
  )
}
