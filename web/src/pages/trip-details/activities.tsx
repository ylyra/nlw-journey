import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CheckCircle2, CircleDashed } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../../lib/axios'

type Activity = {
  date: string
  activities: {
    id: string
    title: string
    occurs_at: string
  }[]
}

export function Activities() {
  const params = useParams<{
    tripId: string
  }>()
  const [activities, setActivities] = useState<Activity[]>([])

  useEffect(() => {
    async function loadTrip() {
      try {
        const response = await api.get<{
          activities: Activity[]
        }>(`/trips/${params.tripId}/activities`)

        setActivities(response.data.activities)
      } catch (error) {}
    }

    loadTrip()
  }, [params.tripId])

  return (
    <div className="space-y-8">
      {activities.map((activity) => (
        <div
          className="space-y-2.5 data-[state=past]:opacity-60 group"
          data-state={
            new Date(activity.date) < new Date()
              ? 'past'
              : new Date(activity.date) > new Date()
                ? 'future'
                : 'today'
          }
          key={activity.date}
        >
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-semibold group-data-[day=today]:text-zinc-50 text-zinc-300">
              Dia {format(new Date(activity.date), 'd', { locale: ptBR })}
            </span>

            <span className="text-xs text-zinc-500">
              {format(new Date(activity.date), 'EEEE', { locale: ptBR })}
            </span>
          </div>

          {activity.activities.length === 0 && (
            <p className="text-sm text-zinc-500">
              Nenhuma atividade cadastrada nessa data.
            </p>
          )}

          {activity.activities.length > 0 && (
            <div className="space-y-3">
              {activity.activities.map((item) => (
                <div
                  className="bg-zinc-900 rounded-xl shadow-shape py-2.5 px-4 flex items-center justify-between gap-2"
                  key={item.id}
                >
                  <div className="flex items-center gap-3">
                    {new Date(item.occurs_at) < new Date() ? (
                      <CheckCircle2 className="size-5 text-lime-300" />
                    ) : (
                      <CircleDashed className="size-5 text-zinc-400" />
                    )}
                    <span>{item.title}</span>
                  </div>

                  <span className="text-zinc-400">
                    {format(new Date(item.occurs_at), 'HH:mm', {
                      locale: ptBR,
                    })}
                    h
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      <div
        className="space-y-2.5 data-[state=past]:opacity-60 group"
        data-state="past"
      >
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-semibold group-data-[day=today]:text-zinc-50 text-zinc-300">
            Dia 17
          </span>
          <span className="text-xs text-zinc-500">Sábado</span>
        </div>
      </div>

      <div
        className="space-y-2.5 data-[state=past]:opacity-60 group"
        data-state="today"
      >
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-semibold group-data-[day=today]:text-zinc-50 text-zinc-300">
            Dia 18
          </span>
          <span className="text-xs text-zinc-500">Sábado</span>
        </div>

        <div className="space-y-3">
          <div className="bg-zinc-900 rounded-xl shadow-shape py-2.5 px-4 flex items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="size-5 text-lime-300" />
              <span>Corrida de Kart</span>
            </div>

            <span className="text-zinc-400">08:00h</span>
          </div>

          <div className="bg-zinc-900 rounded-xl shadow-shape py-2.5 px-4 flex items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <CircleDashed className="size-5 text-zinc-400" />
              <span>Corrida de Kart</span>
            </div>

            <span className="text-zinc-400">08:00h</span>
          </div>
        </div>
      </div>

      <div
        className="space-y-2.5 data-[state=past]:opacity-60 group"
        data-state="future"
      >
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-semibold group-data-[day=today]:text-zinc-50 text-zinc-300">
            Dia 17
          </span>
          <span className="text-xs text-zinc-500">Sábado</span>
        </div>

        <div className="space-y-3">
          <div className="bg-zinc-900 rounded-xl shadow-shape py-2.5 px-4 flex items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="size-5 text-lime-300" />
              <span>Corrida de Kart</span>
            </div>

            <span className="text-zinc-400">08:00h</span>
          </div>

          <div className="bg-zinc-900 rounded-xl shadow-shape py-2.5 px-4 flex items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <CircleDashed className="size-5 text-zinc-400" />
              <span>Corrida de Kart</span>
            </div>

            <span className="text-zinc-400">08:00h</span>
          </div>
        </div>
      </div>
    </div>
  )
}
